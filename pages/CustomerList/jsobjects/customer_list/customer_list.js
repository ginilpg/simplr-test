export default {
	saveSearchFilters: () => {
		storeValue('searchByLabel', edit_tenant_search_by_dropdown.selectedOptionLabel)
		storeValue('searchByValue', edit_tenant_search_by_dropdown.selectedOptionValue)
		storeValue('searchStatus', edit_tenant_search_by_status.selectedOptionValue)
		storeValue('searchText', edit_tenant_search_text.text)
	},
	onTabSelection: () => {
		customer_details_tabs.selectedTab === "Schedulers" ? getSchedulerList.run() : customer_details_tabs.selectedTab === "Delegation" ? getDelegationList.run() : null
	},
	delegationShow: () => {
			let data = getDelegationList.data.filter((item)=>{ 
				return item.account_id === customer_list_table.selectedRow.CustomerID;
			})
			return data.length > 0 ? true : false; 
	},
	schedulerShow: () => {
			let data = getSchedulerList.data.result
			console.log(data.length)
			return data.length > 0 ? true : false; 
	},
	updateCustStatus: async () => {
		let statusData = {}
	 	if(customer_details_table.selectedRow.status == "Inactive") {
		  statusData = {"status" :"Active"}
	 	} 
		else if(customer_details_table.selectedRow.status == "Active"){
			statusData = {"status" :"Inactive"}
		}
		await putTenantStatus.run( async () => {
			showAlert("The status was updated successfully.", "success")
			await postCustomerList.run()
		}, ()=>{
			storeValue('statusCode', putTenantStatus.responseMeta.statusCode)
			common_utils.error401()
		}, {statusData})
	},
	getCustomerUrl: async (accountId,requestId) => {
		const {url} = await postLoginAs.run({accountId,requestId})
		navigateTo(url,{}, "NEW_WINDOW");
	},
	refreshTable: () => {
		customer_details_tabs.selectedTab === "Instances" ? postCustomerList.run() :  customer_details_tabs.selectedTab === "Schedulers" ? getSchedulerList.run() : getDelegationList.run();
	},
	updateFrequency: async () => {
		await postFrequencyChange.run( async () => {
			showAlert("Frequency updated successfully", "success")
			closeModal('change_frequency')
			await getSchedulerList.run()
		}, () => common_utils.error401())
	}
}
	