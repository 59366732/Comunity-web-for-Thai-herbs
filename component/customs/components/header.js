import React from "react";
import Head from "next/head";

export default function Header() {
	return (
		<div>
			<Head>
				<title>Community Web for Thai herbs.</title>
				<link rel="icon" href="/favicon.ico" />
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
				<link
					href="http://fonts.googleapis.com/css?family=Roboto"
					rel="stylesheet"
					type="text/css"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/icon?family=Material+Icons"
				/>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react.min.js"></script>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react-dom.min.js"></script>
			</Head>
		</div>
	);
}
