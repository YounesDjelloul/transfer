import { useApi } from '/@src/composable/useApi'
import API_URLs from '/@src/utils/api/urls'

const api = useApi()

export async function getMatters(pageQuery) {

	const { data: data } = await api.get(API_URLs.MATTERS + pageQuery)
	return data
}

export async function createNewMatter(body: object) {
	
	return await api.post(API_URLs.MATTERS, body)
}

export async function getMatterDetails(matterPk: string) {

	const { data: data } = await api.get(API_URLs.MATTERS+clientPk)
	return data
}

export async function deleteMatterRequest(matterPk: string) {

	const response = await api.delete(API_URLs.MATTERS+clientPk)
}

export async function updateMatterDetailsRequest(matterPk: string, body: object, methodAllowed: string) {
	const result = await api.patch(API_URLs.MATTERS+matterPk+'/', body)
	return result
}

export async function getMatterSchemas() {

	const { data } = await api.options(API_URLs.MATTERS)
	return data
}

export async function getFieldChoices(endpointUrl, searchKeyword) {
	const { data } = await api.get(`${endpointUrl}?search=${searchKeyword}`)
	return data.results
}

export async function getJobTitleDetails(endpointUrl, jobPk) {
	const response = await api.get(`${endpointUrl}${jobPk}`)
	return response.data
}