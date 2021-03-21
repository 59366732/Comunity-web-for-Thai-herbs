import React from 'react';
import Head from 'next/head';


export default function Header() {
  return (
    <div>
      <Head>
        <title>Community Web for Thai herbs.</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
			  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </Head>
    </div>
  )
}