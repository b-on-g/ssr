namespace $ {

	const rows = [
		{ id: 'a1', name: 'n1' },
		{ id: 'a2', name: 'n2' },
	]

	$mol_test( {

		'server table rendered with links and state'( $ ) {

			const html = $.$bog_ssr_html( '/server-side-rendered', rows )

			$mol_assert_equal( html.match( /<tr /g )?.length, 2 )
			$mol_assert_equal( html.includes( 'href="server-side-rendered/a2"' ), true )
			$mol_assert_equal( html.includes( 'id="bog_ssr_rows"' ), true )

		},

		'throughput table rendered without links'( $ ) {

			const html = $.$bog_ssr_html( '/ssr-throughput', rows )

			$mol_assert_equal( html.match( /<tr /g )?.length, 2 )
			$mol_assert_equal( html.includes( '<a ' ), false )

		},

		'client page left for browser'( $ ) {

			const html = $.$bog_ssr_html( '/client-side-rendered', rows )

			$mol_assert_equal( html.includes( '<body mol_view_root="$bog_ssr"></body>' ), true )

		},

		'detail rendered by path'( $ ) {

			const html = $.$bog_ssr_html( '/server-side-rendered/a1', rows )

			$mol_assert_equal( /<p id="detail-id"[^>]*>a1<\/p>/.test( html ), true )

		},

	} )

}
