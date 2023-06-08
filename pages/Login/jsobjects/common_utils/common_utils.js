export default {
	onLoad: async () => {
		await storeValue('searchByLabel', undefined)
		await storeValue('searchByValue', undefined)
		await storeValue('searchStatus', undefined)
		await storeValue('searchText', undefined)
	},
	error401: () => {
		if (appsmith.store.statusCode === "401 UNAUTHORIZED" || appsmith.store.statusCode === "403 FORBIDDEN") {
			showAlert("Session has expired, please login again.", "error")
			navigateTo('Login',{ embed: true });
		}
	},
	findEnv: () => {
		const env = appsmith.URL.hostname.split('.')[1]
		const oldDev = appsmith.URL.hostname.includes("dev.zeus")
		if (oldDev){
			return '62c3dea240271707caad3f14'
		}
		console.log(env)
		switch(env) {
		case 'dev':
			return '64648c3b32223024abda9e52'
			break;
		case 'qa':
			return '62d4d05cbc9bad7c8995cda7'
			break;
		case 'perf':
			return '642baeb7a807e57269a5b4de'
			break;
		case 'e2e':
			return '6426cfa1b0964614af50c4e3'
			break;
		case 'test':
			return '63f7120ec8bc3963ecc2c4fb'
			break;
		case 'eu':
			return '643e4826a91cf713b53b78d3'
			break;
		case 'app':
			return '62d159fbefd0f760eac0fbbb'
			break;
		}
	}
}