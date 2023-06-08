export default {
	getDelegationList : async () => {
		const data = await getDelegationList.run()
		console.log(data)
	},
	getCustomerUrl: async (accountId,requestId) => {
		const {url} = await postLoginAs.run({accountId,requestId})
		navigateTo(url,{}, "NEW_WINDOW");
	}
}