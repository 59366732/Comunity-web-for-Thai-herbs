// const firebase = require('firebase/app'); // for CommonJs modules
// import * as firebase from "firebase/app"; //for TypeScript
import firebase from "firebase/app"; //for ES modules
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import React, { useState, useEffect } from "react";

const Config = {
	apiKey: "AIzaSyBBPkqMLNGGuV0H8sxyXcoPZnRpnGbsQLg",
	authDomain: "my-web-3f28e.firebaseapp.com",
	databaseURL: "https://my-web-3f28e.firebaseio.com",
	projectId: "my-web-3f28e",
	storageBucket: "my-web-3f28e.appspot.com",
	messagingSenderId: "365046715258",
	appId: "1:365046715258:web:9283a49c2e18ff7f643cc3",
	measurementId: "G-DE8EGXPWHT",
};

if (!firebase.apps.length) {
	firebase.initializeApp(Config);
}

// const db = firebaseApp.firestore();
const db = firebase.firestore();
export default db;

export const auth = firebase.auth();
export const storage = firebase.storage();

const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
	auth.signInWithPopup(provider);
};

//user document

export const generateUserDocument = async (user, additionalData) => {
	if (!user) return;
	const userRef = db.doc(`users/${user.uid}`);
	const snapshot = await userRef.get();
	if (!snapshot.exists) {
		const {
			email,
			displayName,
			photoURL,
			score = 0,
			level = "user",
			addHerb = false,
		} = user;
		try {
			await userRef.set({
				email,
				displayName,
				photoURL,
				score,
				level,
				addHerb,
				...additionalData,
			});
		} catch (error) {
			console.error("Error creating user document", error);
		}
	}
	return getUserDocument(user.uid);
};

const getUserDocument = async (uid) => {
	if (!uid) return null;
	try {
		const userDocument = await db.doc(`users/${uid}`).get();
		return {
			uid,
			...userDocument.data(),
		};
	} catch (error) {
		console.error("Error fetching user", error);
	}
};

//activity ---------------------------------------

export const generateActivity = async (user, additionalData) => {
	if (!user) return;
	const activityRef = db.doc(`activity/${user.uid}`);
	// const activityRef = db.doc(`activity/${user.uid}`);
	const snapshot = await activityRef.get();
	if (!snapshot.exists) {
		const {
			uid = user.uid,
			herbid = "",
			action = 0,
			timestamp = firebase.firestore.FieldValue.serverTimestamp(),
		} = user;
		try {
			await db.doc(`activity/${user.uid}`).set({
				uid,
				herbid,
				action,
				timestamp,
				...additionalData,
			});
		} catch (error) {
			console.error("Error creating activity document", error);
		}
	}
	return getActivityDoc(user.uid);
};

const getActivityDoc = async (uid) => {
	let content = {};

	if (!uid) return null;
	try {
		await db
			.collection("activity")
			.where("uid", "==", uid)
			.get()
			.then(function (querySnapshot) {
				content = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
			});
		return {
			uid,
			...content,
		};
	} catch (error) {
		console.error("Error fetching user", error);
	}
};
