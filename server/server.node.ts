namespace $ {

	const files: Record< string, $mol_rest_port_mime > = {
		'/web.js': 'application/javascript',
		'/web.js.map': 'application/json',
		'/web.css': 'text/css',
	}

	export class $bog_ssr_server extends $mol_rest_resource {

		@ $mol_memo.method
		dir() {
			return $mol_file.absolute( __dirname )
		}

		GET( msg: $mol_rest_message ) {

			const path = msg.uri().pathname

			const type = files[ path ]
			if( type ) return msg.reply( this.dir().resolve( path.slice( 1 ) ).buffer(), { type } )

			const rows = $mol_wire_sync( this.$ ).$bog_ssr_rows_load()
			if( path === '/rows' ) return msg.reply( rows )

			msg.reply( this.$.$bog_ssr_html( path, rows ), { type: 'text/html;charset=utf-8' } )
		}

	}

}
