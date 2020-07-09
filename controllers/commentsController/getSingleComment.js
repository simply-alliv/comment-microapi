const Comments = require("../../models/comments");
const mongoose = require("mongoose");

// Utilities
const customErrors = require("../../utils/customErrors");
const responseHandler = require("../../utils/responseHandler");

/**
 * @author
 *
 * Gets a single comment
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getSingleComment = async (req, res, next) => {
  // const { refId } = req.query;
  const commentId = req.params.commentId;
  const { applicationId } = req.token; //this will be retrieved from decoded api token after full auth implementation
  const query = { _id: commentId, applicationId: applicationId };
  // if (refId) query.refId = refId;
  try {
    // check if commentId is valid
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return next(
        new customErrors.UnprocessableEntityError([
          '"commentId" in path is invalid',
        ])
      );
    }

    const comment = await Comments.findOne(query);
    if (!comment) {
      return next(new customErrors.NotFoundError(commentId));
    }
    const data = {
      commentId: comment._id,
      refId: comment.refId,
      applicationId: comment.applicationId,
      ownerId: comment.ownerId,
      content: comment.content,
      origin: comment.origin,
      numOfVotes: comment.upVotes.length + comment.downVotes.length,
      numOfUpVotes: comment.upVotes.length,
      numOfDownVotes: comment.downVotes.length,
      numOfFlags: comment.flags.length,
      numOfReplies: comment.replies.length,
    };

    return responseHandler(res, 200, data, `Comment Retrieved Successfully`);
  } catch (err) {
    return next(new customErrors.InternalServerError());
  }
};

module.exports = getSingleComment;
