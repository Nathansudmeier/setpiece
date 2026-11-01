'use client';
export default function ErrorView({reset}:{reset:()=>void}){return <section><h1>Facturatie is niet bereikbaar</h1><p>De gegevens zijn niet geladen. Je laatste wijziging kan al verwerkt zijn; controleer de actuele versie voordat je opnieuw opslaat.</p><button className="bw-primary" onClick={reset}>Probeer opnieuw</button></section>;}
