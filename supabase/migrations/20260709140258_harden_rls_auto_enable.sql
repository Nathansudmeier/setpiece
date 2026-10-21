-- Event-triggerfunctie hoort niet via de Data API aanroepbaar te zijn.
-- De event trigger zelf draait als eigenaar en blijft gewoon werken.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;