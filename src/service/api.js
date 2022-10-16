import { postParam, postBody, getParam, getParam2 } from './axios'

//  登录接口
export const login = (params) => { return postParam('/api/sys/login', params, false) }
//  注册接口
export const register = (params) => { return postBody('/api/api-u/users/register', params, false) }

export const changePass = (pass) => { return postParam('/api/api-u/users/changePassword?password='+pass, {}, false) }
// 获取当前登录用户信息
export const getCurrentUser = (params) => { return postBody('/api/api-u/users/current', params, true) }

/* 首页 */
//  本地帮扶列表
export const getPersonList = (params) => { return postParam('/api/api-a/appeal/apply-anon/person', params, false) }

export const getChild = (params) => { return postBody('/api/api-a/child/child-anon/childList', params, false) }
// 个人已完成
export const getPersonCompletedList = (params) => { return postParam('/api/api-a/appeal/apply-anon/personCompleted', params, false) }
// 公益求助列表
export const getPublicList = (params) => { return postParam('/api/api-a/appeal/apply-anon/public', params, false) }
// 公益已完成
export const getPublicCompletedList = (params) => { return postParam('/api/api-a/appeal/apply-anon/publicCompleted', params, false) }
// 公告列表
export const getBulletinList = (params) => { return postParam('/api/api-a/bulletin/bulletin-anon/home', params, false) }
// 最新捐款列表
export const getLatestDontateList = (params) => { return postParam('/api/api-p/record/apply-anon/latestDontate', params, false) }
// 立即支付
export const getPay = (body) => { return postBody('/api/api-p/donate/pay', body, true) }
// 获取支付状态
export const getPayState = (id) => { return getParam2('/api/api-p/donate/pay/state/' + id, id, true) }
// 查询我的儿童信息
export const getMyChildList = (params) => { return postParam('/api/api-a/child/child-anon/myChild', params, false) }
// 创建儿童信息
export const createChild = (params) => { return postBody('/api/api-a/child/child-anon/createChild', params, true) }
// 根据ID获取用户信息
export const getChildById = (id) => { return postBody('/api/api-a/child/child-anon/getChildById?id=' + id, {}, true) }
// 修改儿童信息
export const updateChild = (params) => { return postBody('/api/api-a/child/child-anon/updateChild', params, true) }
// 根据ID删除用户信息
export const delChildById = (id) => { return postBody('/api/api-a/child/child-anon/delChild?id=' + id, {}, true) }
// 获取儿童列表
export const getChildList = (params) => { return postParam('/api/api-a/child/child-anon/getChildList', params, true) }
// 审批儿童
export const approveChild = (id,status) => { return postParam('/api/api-a/child/child-anon/approve?id=' + id + '&status=' + status, {}, true) }

/* 用户求助模块 */
// 用户求助申请
export const toApply = (params) => { return postBody('/api/api-a/appeal/apply-anon/addApply', params, true) }
// 修改求助申请
export const editApply = (params) => { return postBody('/api/api-a/appeal/apply-anon/updateApply', params, true) }
// 获取活动列表
export const myApplyList = (params) => { return postBody('/api/api-a/appeal/apply-anon/mylist', params, true) }
// 根据Id获取活动基本信息
export const getApplyById = (id) => { return postBody('/api/api-a/appeal/apply-anon/getApplyById?id='+id, {}, true) }

// 用户求助详情
export const getPersonDetailById = (id) => { return getParam('/api/api-a/appeal/apply-anon/personDetail/' + id, id, true) }
export const getDontateByUser = (params) => { return postParam('/api/api-p/record/getDontateByUser', params, true) }
export const getApplyByUser = (params) => { return postParam('/api/api-a/apply/getApplyByUser', params, true) }
export const delApply = (id) => { return postParam('/api/api-a/appeal/apply-anon/delApply?id=' + id, {}, true) }

/* 公益求助模块 */
// 公益求助详情
export const getPublicDetailById = (id) => { return postBody('/api/api-a/appeal/apply-anon/getApplyInfo?id=' + id, id, false) }

export const donateMoney = (params) => { return postBody('/api/api-p/record/apply-anon/donate', params, true) }

export const usedMoney = (params) => { return postBody('/api/api-p/record/apply-anon/addUsedRecord', params, true) }
/* 捐款记录米快 */
// 捐款列表排行榜
export const getDonateBoardList = (params) => { return postParam('/api/api-p/record/donateBoard', params, false) }
// 已完成捐赠
export const getDonatedList = (params) => { return postParam('/api/api-a/appeal/apply-anon/completed', params, false) }

// 后台管理

export const findUserByIdd = (id) => { return getParam('/api/api-u/users/' + id , id, true) }
/**
 * 系统管理
 */
//系统管理-权限列表
export const permissionList = (params) => { return postBody('/api/api-u/permissions/find', params, true) }
//系统管理-角色列表
export const roleList = (params) => { return postBody('/api/api-u/roles/find', params, true) }

/**
 * 用户管理
**/
// 用户管理-获取用户列表
export const userList = (params) => { return postBody('/api/api-u/users/find', params, true) }
// 用户管理-获取管理员列表
export const adminList = (params) => { return postBody('/api/api-u/users/find', params, true) }
// 用户管理-保存（添加编辑）
export const userUpdate = (params) => { return postBody('/api/api-u/users/update', params, true) }
// 禁用用户
export const banUser = (id) => { return getParam('/api/api-u/users/changeUserState?id=' + id+'&status=2', id, true) }
// 解禁用户
export const unbanUser = (id) => { return getParam('/api/api-u/users/changeUserState?id=' + id+'&status=1', id, true) }
// 管理员注册
export const sysRegist = (params) => { return postBody('/api/donate/api/user//admin/regist', params, true) }
//资质审核
export const userQualificate = (params) => { return postBody('/api/api-u/users/userQualificate/', params, true) }
//审核某个
export const getQualificate = (id) => { return getParam('/api/api-u/users/getQualificate/' + id, id, true) }
//审核通过
export const qualificateSuccess = (id) => { return getParam('/api/api-u/users/qualificateSuccess/' + id, id, true) }
//审核拒绝
export const qualificateFail = (id) => { return getParam('/api/api-u/users/qualificateFail/' + id, id, true) }
//获取某用户的所有角色
export const findRoleByUserId = (id) => { return getParam('/api/api-u/users/' + id + '/roles', id, true) }

/**
 * 权限管理
 */
//权限删除
export const delPermission = (id) => { return getParam('/api/api-u/permissions/delete/' + id, id, true) }
//权限修改
export const permissionSave = (params) => { return postBody('/api/api-u/permissions/modify', params, true) }
//权限添加
export const permissionAdd = (params) => { return postBody('/api/api-u/permissions/add', params, true) }
//根据id获取权限
export const findById = (id) => { return getParam('/api/api-u/permissions/findById/' + id, id, true) }
//获取某角色的所有权限
export const findPerByRoleId = (id) => { return getParam('/api/api-u/roles/' + id + '/permissions', id, true) }
//给用户分配角色
export const distributeRoles = (params) => { return postBody('/api/api-u/users/distributeRoles', params, true) }
/**
 * 角色管理
 */
//角色删除
export const delRole = (id) => { return getParam('/api/api-u/roles/delete/' + id, id, true) }
export const roleUpdate = (params) => { return postBody('/api/api-u/roles/update', params, true) }
//角色添加
export const addRole = (params) => { return postBody('/api/api-u/roles/add', params, true) }
//角色权限分配
export const distribuePer = (params) => { return postBody('/api/api-u/roles/distributePer', params, true) }
export const findRoleById = (id) => { return getParam('/api/api-u/roles/' + id, id, true) }
/**
 * 公益项目管理
 */
export const getPublicVerified = (params) => { return postParam('/api/api-a/appeal/publicVerified', params, true) }
export const getApplyList = (params) => { return postBody('/api/api-a/appeal/apply-anon/list', params, true) }
export const approveApplyList = (id,status) => { return postBody('/api/api-a/appeal/apply-anon/approveApply?id='+id+"&status="+status, {}, true) }
export const componentApplyList = (id,status) => { return postBody('/api/api-a/appeal/apply-anon/componentApply?id='+id+"&status="+status, {}, true) }
/**
 * 本地帮扶管理
 */
export const getPersonVerified = (params) => { return postParam('/api/api-a/appeal/personVerified', params, true) }
export const getPersonUnVerified = (params) => { return postParam('/api/api-a/appeal/personUnVerified', params, true) }
export const applyUpdate = (params) => { return postBody('/api/api-a/apply/update', params, true) }
export const applyDel = (id) => { return getParam('/api/api-a/apply/delete?id=' + id, id, true) }
export const getAppealById = (id) => { return getParam('/api/api-a/appeal/apply/getAppealById/' + id, id, true) }

/**
 * 上线、下线(申请、拒绝)
 */
//上线
export const approve = (id) => { return getParam('/api/api-a/apply/approve/' + id, id, true) }
//下线
export const deny = (id) => { return getParam('/api/api-a/apply/deny/' + id, id, true) }
/**
 * 捐款管理
 */
export const donateList = (params) => { return postParam('/api/newscategory/getNewsCategoryList', params, true) }
export const addNewCategory = (params) => { return postParam('/api/newscategory/addNewsCategoty', params, true) }
export const updateNewsCategory = (params) => { return postParam('/api/newscategory/updateNewsCategory', params, true) }
export const delNewsCategory = (id) => { return postParam('/api/newscategory/delNewCategory?id='+id, {}, true) }
export const donateCount = (params) => { return postBody('/api/news/getNewsList', params, true) }
export const addNews = (params) => { return postBody('/api/news/addNews', params, true) }
export const delNews = (id) => { return postBody('/api/news/delNews?id='+id, {}, true) }

export const getSpace = (params) => { return postBody('/api/space/getSpaceList', params, true) }
export const addSpace = (params) => { return postBody('/api/space/addSpace', params, true) }
export const delSpace = (id) => { return postBody('/api/space/delSpace?id='+id, {}, true) }

export const getSpaceReply = (params) => { return postBody('/api/spaceReply/getSpaceList', params, true) }
export const addSpaceReply = (params) => { return postBody('/api/spaceReply/addSpace', params, true) }
export const delSpaceReply = (id) => { return postBody('/api/spaceReply/delSpace?id='+id, {}, true) }
/**
 * 公告管理
 */
export const bulletinList = (params) => { return postBody('/api/api-a/bulletin/bulletin-anon/list', params, true) }
// 批量删除
export const deleteBulletin = (id) => { return postBody('/api/api-a/bulletin/bulletin-anon/delBulletIn?id='+id, {}, true) }
// 修改公告
export const bulletinUpdate = (params) => { return postBody('/api/api-a/bulletin/bulletin-anon/addBulletInList', params, true) }
export const bulletinAdd = (params) => { return postBody('/api/api-a/bulletin/add', params, true) }
export const bulletinOffline = (id) => { return postBody('/api/api-a/bulletin/bulletin-anon/changeBulletIn?id=' + id + '&status=1', {}, true) }
export const bulletinOnline = (id) => { return postBody('/api/api-a/bulletin/bulletin-anon/changeBulletIn?id=' + id + '&status=0', {}, true) }
export const getBulletinByid = (id) => { return getParam('/api/api-a/bulletin/bulletin-anon/get/' + id, id, true) }

// 统计图
export const getLastWeek = (id) => { return getParam('/api/api-a/apply/apply-anon/getLastWeek/' + id, id, false) }
// 支付
export const getLastWeekPay = (id) => { return getParam('/api/api-p/donate/pay-anon/getLastWeek/' + id, id, false) }
//轮播图
export const getCarouselImg = (id) => { return getParam('/api/api-a/appeal/apply-anon/pageDetail/' + id, id, false) }
