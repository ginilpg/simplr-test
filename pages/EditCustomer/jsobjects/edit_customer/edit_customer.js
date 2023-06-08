export default {
	viewCustomer : async () => {
		if (!appsmith.URL.queryParams.cid) {
			showAlert("Please select customer from customer list.", "error")
			navigateTo('CustomerList',{embed: true},'SAME_WINDOW')
		}
	},
	check: (id) => {
		const item = viewCustomer.data.license.features.filter(i => {
			return i.features_id === id;
		})
		return item.length > 0 && item[0].status === "success" ? true : false
	},
	featureList : () => {
		let viewCustomerData = viewCustomer.data.license.features;
		let finalFeatureList = [];
		//This needs to be made more generic
		let isFeatureChecked = {
			1: core_checkbox.isChecked,
			2: recog_checkbox.isChecked,
			3: newsletter_checkbox.isChecked,
			4: video_checkbox.isChecked,
			5: sentiment_ai_checkbox.isChecked
		};
		
		const featureStatus = {
			pending: "pendingActivation",
			failed: "failed",
			success: "success"
		}
		
		let array11 = core_checkbox.isChecked || core_checkbox.isDisabled ? [1]:[];
		let array2 = recog_checkbox.isChecked || recog_checkbox.isDisabled ? [2]:[]
		let array3 = newsletter_checkbox.isChecked || newsletter_checkbox.isDisabled ? [3]:[]
		let array4 = video_checkbox.isChecked || video_checkbox.isDisabled ? [4]:[]
		let array5 = sentiment_ai_checkbox.isChecked || sentiment_ai_checkbox.isDisabled ? [5]:[]
		let array1 = array11.concat(array2, array3, array4, array5)//.filter((item, i, arr) => item && arr.indexOf(item) === i);
		finalFeatureList = viewCustomerData.filter(function(o1){
				if(o1.status === featureStatus.failed){
					array1.push(o1.features_id)
				}
				return array1.some(function(o2){
					if(o2 != null && o2 != undefined){
						return o1.features_id === o2; 
					}
				});		
		}).map((feature)=>{
			if( isFeatureChecked[feature.features_id] && 
				 feature.status===featureStatus.failed && 
				 feature.retry_count < feature.max_retries){
				feature.status = featureStatus.pending;
			}
			return feature;
		});
		let newArray = []
		newArray = array1.filter(function(o1){
			return !viewCustomerData.some(function(o2){
					return o1 === o2.features_id; 
			});
		})
		newArray.map((i)=>{
			finalFeatureList.push({
						features_id: i,
						status: featureStatus.pending,
						reason: null
				});
		})
		finalFeatureList = finalFeatureList.map(i => {
			delete i.retry_count; 
			delete i.max_retries;
			return i 
		})
		return finalFeatureList
	},
	joinFields:(fields=[])=>{
			const totalFields = fields.length;
			let joined = "";
			for(let i = 0; i< totalFields; i++){
				if(totalFields>1 && i===totalFields-1){
					joined += ` and ${fields[i]}`;
				}else{
					joined += `${i>0?', ':''}${fields[i]}`;
				}
			}
			return joined;
		},
	editCustomer : async () => {
			const viewResult = viewCustomer.data;
			const formData = {
				subdomain_name: viewResult.subdomain_name,
				account_type_id: 1,
				display: {
					company_display_name: customer_name.text,
					timezone: customer_timezone.selectedOptionValue,
					language_id: parseInt(customer_language.selectedOptionValue),
					locale_id: customer_locale.selectedOptionValue
				},
				primary_contact: {
					first_name: primary_contact_first_name.text,
					last_name: primary_contact_last_name.text,
					email: primary_contact_email.text,
					//phone_code: primary_contact_phonecode.selectedOptionValue,
					phone: primary_contact_phonenumber.text,
					//mobile_code: primary_contact_officecode.selectedOptionValue,
					mobile: primary_contact_officenumber.text
				},
				instance_admin_user: {
					first_name: viewResult.instance_admin_user.first_name,
					last_name: viewResult.instance_admin_user.last_name,
					email: viewResult.instance_admin_user.email,
					//phone_code: app_manager_phonecode.selectedOptionValue,
					phone: viewResult.instance_admin_user.phone || "",
					//mobile_code: app_manager_officecode.selectedOptionValue,
					mobile: viewResult.instance_admin_user.mobile,
					timezone: viewResult.instance_admin_user.timezone,
					language_id: parseInt(viewResult.instance_admin_user.language_id),
					locale_id: viewResult.instance_admin_user.locale_id
				},
				license: {
					features: this.featureList(),
					platform: parseInt(license_count.text),
					service_start_date: Effective_from_date.formattedDate,
					service_end_date: Effective_from_date.formattedDate,
					contract_duration: contract_duration.text
				}
			}
			
		// Primary contact: Processing start
		const REQUIRED_PRIMARY_CONTACT_FIELD_NAMES = {
			first_name: "first name",
			last_name: "last name",
			email: "email",
		};
		
		const requiredPrimaryContactEmptyFields = Object.entries(formData.primary_contact).
		filter(([key, value])=>REQUIRED_PRIMARY_CONTACT_FIELD_NAMES.hasOwnProperty(key) &&  value.length===0).
		map(([key])=>REQUIRED_PRIMARY_CONTACT_FIELD_NAMES[key]);
		
		const havePrimaryContactDetails = Object.entries(formData.primary_contact).some(([_, value])=>value.length!=0);

		if (!havePrimaryContactDetails || requiredPrimaryContactEmptyFields.length===0) {
			delete formData.primary_contact;
			if(formData.instance_admin_user.phone.length == 0){
				delete formData.instance_admin_user.phone;
			}
		}else{
			showAlert(`Please enter a valid value for ${this.joinFields(requiredPrimaryContactEmptyFields)} under primary contact`);
			return;
		}
		// Primary contact: Processing ends
		
			console.log("createCustomerApi", formData)
			await editCustomerApi.run(()=>{
				showAlert("Updated customer details successfully.", "success")
				navigateTo('ViewCustomer',{'cid': appsmith.URL.queryParams.cid}, 'SAME_WINDOW')
			}, (e)=>{
				showAlert(e.errors[0].message, "error");
			}, {formData});	
	},
	getManageFeature: (id) => {
			const item = getFeatureList.data.filter(i => {
			return i.id === id;
		})
		return item.length >= 1 ? true : false
	},
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
				infoIcon = retry === 0 ? {status:`Feature activation blocked, email send to CS team.`, color: '#dc2626', fail: 'blocked'} : {status:`Feature activation failed, you are left with ${retry} attempts.`, color: '#dc2626'};
				break;
		}
		return infoIcon
	},
	defaultSelectedfeature : (id) => {
		const item = viewCustomer.data.license.features.filter(i => {
			return i.features_id === id;
		})
		return item[0]?.status != "failed"?
			[item[0]?.features_id] : 0
	},
	viewdata : (allData, customerData) => {
		let filteredData = allData.filter(item => item.id === customerData)
		let formatedData = filteredData[0].name
		return formatedData;
	},
	sortByKey:(array, key) => {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
       return ((x < y) ? -1 : ((x > y) ? 1 : 0));
   	});
	}	
}