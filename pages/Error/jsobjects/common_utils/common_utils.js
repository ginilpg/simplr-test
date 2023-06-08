export default {
	error401: () => {
		if (appsmith.store.statusCode === "401 UNAUTHORIZED" || appsmith.store.statusCode === "403 FORBIDDEN") {
			showAlert("Session has expired, please login again.", "error")
			navigateTo('Login',{ embed: true });
		}
	},
	// findEnv: () => {
		// const env = appsmith.URL.hostname.split('.')[1]
		// return env === 'dev' ? '62c3dea240271707caad3f14' : env === 'qa' ? '62d4d05cbc9bad7c8995cda7' : '62d159fbefd0f760eac0fbbb'
	// },
	findEnv: () => {
		const env = appsmith.URL.hostname.split('.')[1]
		const oldDev = appsmith.URL.hostname.includes("zeus")
		if (oldDev){
			return '62c3dea240271707caad3f14'
		}
		return env === 'dev' ? '63da146103b3361a1ffbb7ac' : env === 'qa' ? '62d4d05cbc9bad7c8995cda7' : '62d159fbefd0f760eac0fbbb'
	}
}