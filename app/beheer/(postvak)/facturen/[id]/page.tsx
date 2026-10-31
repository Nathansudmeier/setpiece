import {notFound} from 'next/navigation';
import {z} from 'zod';
import {readBilling} from '@/lib/billing/data';
import InvoiceEditor from '@/components/beheer/billing/InvoiceEditor';
import InvoiceDetail from '@/components/beheer/billing/InvoiceDetail';
export default async function InvoicePage({params}:{params:Promise<{id:string}>}){
 const {id}=await params;if(!z.string().uuid().safeParse(id).success)notFound();
 const data=await readBilling(id);if(!data.invoices[0])notFound();
 return data.invoices[0].status==='concept'?<InvoiceEditor key={id} data={data}/>:<InvoiceDetail key={data.invoices[0].id+':'+data.invoices[0].version} data={data}/>;
}
