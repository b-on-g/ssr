namespace $ {

	const port = Number( process.env.PORT ?? $mol_state_arg.value( 'port' ) ?? 0 )
	if( port ) $bog_ssr_server.port( port )

}
