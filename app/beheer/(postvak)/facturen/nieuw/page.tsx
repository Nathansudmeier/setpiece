import {readBilling} from '@/lib/billing/data';
import InvoiceEditor from '@/components/beheer/billing/InvoiceEditor';
export default async function NewInvoice(){const data=await readBilling();return <InvoiceEditor data={{...data,invoices:[],lines:[]}} initialLineId={crypto.randomUUID()}/>;}
