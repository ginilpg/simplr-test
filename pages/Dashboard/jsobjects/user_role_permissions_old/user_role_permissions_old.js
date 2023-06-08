export default {
	role: {
		'ADMIN':['create_tenant','view_tenant','edit_tenant'],
		'CS_TEAM':['view_tenant'],
		'IMP_TEAM':['create_tenant','view_tenant']
	},
	user_role_map:{
		'ankur.gupta@simpplr.com':'ADMIN',
		'sarthak.malik@simpplr.com':'CS_TEAM',
		'ravi.kanneganti@simpplr.com':'ADMIN'
	},
	getUserRolePermissions: () => {
		const userEmail = appsmith.user.email;
		const role = this.user_role_map[userEmail];
		return {
			'Role': this.user_role_map[userEmail],
			'Permissions': this.role[role]
		}
	}
}