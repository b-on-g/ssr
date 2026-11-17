namespace $.$$ {

	export class $bog_ssr_link extends $.$bog_ssr_link {

		click( event?: MouseEvent ) {

			if( !event ) return null
			if( event.defaultPrevented || event.button || event.ctrlKey || event.metaKey || event.shiftKey ) return null

			event.preventDefault()
			this.$.$bog_ssr_route.path( '/' + this.href() )

			return null
		}

	}

}
