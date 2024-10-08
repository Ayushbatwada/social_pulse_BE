'use strict'

const postService = require('./service');
const likeService = require('../likes/service');
const responseData = require("../../utils/responseData");

module.exports = {
    createPost: (req, res) => {
        let response;
        try {
            postService.createPost(req.body, (err, createPostResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "createPost" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(createPostResponse.code).send(createPostResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "createPost" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    getAllPosts: (req, res) => {
        let response;
        try {
            postService.getAllPosts(req, (err, getAllPostsResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "getAllPosts" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (getAllPostsResponse.code === 200 && getAllPostsResponse.status === 'success') {
                    let flowIds = [];
                    getAllPostsResponse.data.forEach((post) => {
                        flowIds.push(post._id);
                    });
                    const getUsersFlowLikeInfoBody = {
                        flowIds: flowIds,
                        userId: req.query.uid
                    }
                    likeService.getUsersFlowLikeInfo(getUsersFlowLikeInfoBody, (err, getUsersFlowLikeInfoResponse) => {
                        if (getUsersFlowLikeInfoResponse.code === 200 && getUsersFlowLikeInfoResponse.status === 'success') {
                            let postIdsMap = {};
                            getUsersFlowLikeInfoResponse.data.forEach((likeInfo) => {
                                postIdsMap[likeInfo.flowId] = true;
                            });
                            getAllPostsResponse.data.forEach((post) => {
                                if (postIdsMap.hasOwnProperty(post._id)) {
                                    post.hasUserLiked = true;
                                }
                            });
                            res.status(getAllPostsResponse.code).send(getAllPostsResponse);
                        } else {
                            res.status(getAllPostsResponse.code).send(getAllPostsResponse);
                        }
                    });
                } else {
                    res.status(getAllPostsResponse.code).send(getAllPostsResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "getAllPosts" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    getPostDetail: (req, res) => {
        let response;
        try {
           postService.getPostDetail(req, (err, getPostDetailResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "getPostDetail" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (getPostDetailResponse.code === 200 && getPostDetailResponse.status === 'success') {
                    const getUsersFlowLikeInfoBody = {
                        userId: req.query.uid,
                        flowIds: [req.query.poid]
                    }
                    likeService.getUsersFlowLikeInfo(getUsersFlowLikeInfoBody, (err, getUsersFlowLikeInfoResponse) => {
                        if (getUsersFlowLikeInfoResponse.code === 200 && getUsersFlowLikeInfoResponse.status === 'success') {
                            getPostDetailResponse.data.hasUserLiked = true;
                            res.status(getPostDetailResponse.code).send(getPostDetailResponse);
                        } else {
                            res.status(getPostDetailResponse.code).send(getPostDetailResponse);
                        }
                    });
                } else {
                    res.status(getPostDetailResponse.code).send(getPostDetailResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "getPostDetail" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    deletePost: (req, res) => {
        let response;
        try {
            postService.deletePost(req.body, (err, deletePostResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "addComment" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(deletePostResponse.code).send(deletePostResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "addComment" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },
}
