export default {
	featureStatus : (id) => {
		let infoIcon = {};
		const item = viewCustomer.data.license.features.filter(i => {
			return i.features_id === id;
		})
		let retry = item[0].max_retries - item[0].retry_count
		switch(item[0].status) {
			case "pendingActivation":
				infoIcon = {status:'Pending activation', color: '#3f3f46'};
				break;
			case "success":
				infoIcon = {status:'Feature added successfully', color: '#1ea0e6'};
				break;
			case "failed":
				infoIcon = retry === 0 ? {status:`Feature activation blocked, email is send to admin.`, color: '#dc2626'} : {status:`Feature activation failed, you are left with ${retry} attempts.`, color: '#dc2626'};
				break;
		}
		return infoIcon
	},
	check: (id) => {
		const item = viewCustomer.data.license.features.filter(i => {
			return i.features_id === id;
		})
		return item.length >= 1 && item[0].status == "success"? true : false
	},
	viewCustomer : async () => {
		if (!appsmith.URL.queryParams.cid) {
			showAlert("Please select customer from customer list.", "error")
			navigateTo('CustomerList',{embed: true},'SAME_WINDOW')
		}
	},
	viewdata : (allData, customerData) => {
		let filteredData = allData.filter(item => item.id === customerData)
		let formatedData = filteredData[0].name
		return formatedData;
	},
	getManageFeature: (id) => {
			const item = getFeatureList.data.filter(i => {
			return i.id === id;
		})
		return item.length >= 1 ? true : false
		//let obj = getFeatureList.data.map(item => { return { "label": item.name, "value": item.id}})
		//obj.shift() // remove core from list
		//return obj
	},
	defaultSelectedfeature : (id) => {
		const item = viewCustomer.data.license.features.filter(i => {
			return i.features_id === id;
		})
		return item[0]?.status != "failed"?
			[item[0]?.features_id] : 0
	},
}