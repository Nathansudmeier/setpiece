// Opt-in live integration test. Use an isolated, recognizable contact fixture.
// Never place tokens in source or command-line arguments.
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {createClient} from '@supabase/supabase-js';
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const token=process.env.SETPIECE_TEST_ACCESS_TOKEN;
const submission=process.env.SETPIECE_TEST_SUBMISSION_ID;
if(!url||!key||!token||!submission)throw new Error('Vereist: Supabase URL/public key, SETPIECE_TEST_ACCESS_TOKEN en een nieuwe herkenbare SETPIECE_TEST_SUBMISSION_ID zonder bestaande koppeling.');
const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{headers:{Authorization:`Bearer ${token}`},fetch:(input,init)=>fetch(input,{...init,signal:AbortSignal.timeout(15000)})}});
const stamp=crypto.randomUUID();
const payload={title:'[CODEX TEST] API-concurrentie',workspace:'setpiece',source_ref:`Technische verificatie ${stamp}`};
const create=()=>db.rpc('sp_command',{p_request_id:stamp+'-create',p_operation:'task.create',p_payload:payload});
const [a,b]=await Promise.all([create(),create()]);
assert.equal(a.error,null);assert.equal(b.error,null);assert.equal(a.data.id,b.data.id);
const [first,second]=await Promise.all(['A','B'].map(suffix=>db.rpc('sp_command',{p_request_id:stamp+'-'+suffix,p_operation:'task.update',p_payload:{id:a.data.id,notes:suffix},p_expected_version:1})));
assert.equal([first,second].filter(x=>!x.error).length,1);
assert.equal([first,second].find(x=>x.error)?.error.code,'PT409');
const other=await db.rpc('sp_command',{p_request_id:stamp+'-other',p_operation:'task.create',p_payload:{...payload,title:'[CODEX TEST] tweede actie uit dezelfde bron'}});
assert.equal(other.error,null);assert.notEqual(other.data.id,a.data.id);
const links=await Promise.all(['A','B'].map(suffix=>db.rpc('sp_command',{p_request_id:stamp+'-link-'+suffix,p_operation:'request.link',p_payload:{submission_id:submission},p_expected_version:null})));
assert.equal(links.filter(x=>!x.error).length,1);
assert.equal(links.find(x=>x.error)?.error.code,'PT409');
writeFileSync(process.env.SETPIECE_TEST_MANIFEST??'/tmp/setpiece-api-test-manifest.json',JSON.stringify({stamp,itemIds:[a.data.id,other.data.id],submissionId:submission},null,2),{mode:0o600});
console.log('PASS: parallelle dedupe, versieconflict, meerdere acties per bron en eerste aanvraagkoppeling. Test-UUID’s staan in het manifest voor gerichte opruiming.');
