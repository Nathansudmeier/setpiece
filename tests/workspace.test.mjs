import test from 'node:test';
import assert from 'node:assert/strict';
import { validateWork, todayGroups, safeUrl } from '../lib/beheer/model.ts';

test('deadline en opvolging zijn afzonderlijke geldige kalenderdatums', () => {
  assert.throws(() => validateWork('task', { title: 'A', workspace: 'setpiece', due_on: '2026-02-30' }));
  const result = validateWork('task', { title: 'A', workspace: 'setpiece', due_on: '2026-11-01', follow_up_on: '2026-10-21' });
  assert.equal(result.due_on, '2026-11-01');
  assert.equal(result.follow_up_on, '2026-10-21');
});
test('bezig vereist bewijs en afgerond een concrete oplevering', () => {
  assert.throws(() => validateWork('task', { title: 'A', workspace: 'setpiece', status: 'bezig' }));
  assert.throws(() => validateWork('task', { title: 'A', workspace: 'setpiece', status: 'afgerond' }));
  assert.equal(validateWork('task', {title:'A',workspace:'setpiece',status:'afgerond',result:'Geleverd: rapport in Drive'}).status, 'afgerond');
});
test('onveilige bronverwijzingen en onbekende context worden geweigerd', () => {
  assert.equal(safeUrl('javascript:alert(1)'), false);
  assert.equal(safeUrl('https://drive.google.com/file/d/123'), true);
  assert.throws(() => validateWork('task', {title:'A',workspace:'onbekend'}));
  assert.throws(() => validateWork('task', {title:'A',workspace:'prive',source_url:'data:text/html,hi'}));
});
test('Vandaag gebruikt Amsterdam en geen deadline voor zelfgekozen opvolging', () => {
  const rows = [
    {id:'1',status:'open',due_on:'2026-10-19',follow_up_on:null},
    {id:'2',status:'wachten',due_on:null,follow_up_on:'2026-10-20'},
    {id:'3',status:'afgerond',due_on:'2026-10-19'},
    {id:'4',status:'beslissing',due_on:null},
  ];
  const groups=todayGroups(rows,new Date('2026-10-19T22:30:00Z'));
  assert.deepEqual(groups.overdue.map(x=>x.id),['1']);
  assert.deepEqual(groups.followup.map(x=>x.id),['2']);
  assert.deepEqual(groups.decisions.map(x=>x.id),['4']);
});

test('volledig ophalen verliest geen werk achter de eerste duizend rijen', async () => {
  const {collectPages}=await import('../lib/beheer/model.ts');
  const rows=Array.from({length:1001},(_,id)=>({id}));
  const calls=[];
  const result=await collectPages(async(from,to)=>{calls.push([from,to]);return rows.slice(from,to+1);},200);
  assert.equal(result.length,1001);
  assert.equal(result.at(-1).id,1000);
  assert.deepEqual(calls.at(-1),[1000,1199]);
});
