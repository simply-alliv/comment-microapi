const Applications = require("../../../models/applications");
const MsAdmin = require("../../../models/msadmins");
const CustomError = require("../../../utils/customError");
const responseHandler = require("../../../utils/responseHandler");

/**
 * @author Ekeyekwu Oscar
 *
 * Gets all applications using the microservice.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getAllApplications = async (req, res, next) => {
  //get msAdminId from token
  const { msAdminId } = req.token;

  //get all applications and map field names appropriately
  let allApplications;

  let query = {};

  try {
    //check if msAdmin exists
    const msAdmin = await MsAdmin.findById(msAdminId);
    if (!msAdmin) {
      next(new CustomError(404, "MsAdmin account not found"));
      return;
    }

    //get all applications
    const applications = await Applications.paginate(query, {
      ...req.paginateOptions,
      populate: "organizationId",
    });

    allApplications = applications.docs.map((application) => {
      return {
        applicationId: application._id,
        applicationName: application.name,
        organizationId: application.organizationId,
        organizationName: application.organizationId.name,
      };
    });

    // Set page info.
    let pageInfo = {
      currentPage: applications.page,
      totalPages: applications.totalPages,
      hasNext: applications.hasNextPage,
      hasPrev: applications.hasPrevPage,
      nextPage: applications.nextPage,
      prevPage: applications.prevPage,
      pageRecordCount: applications.docs.length,
      totalRecord: applications.totalDocs,
    };

    let data = {
      records: allApplications,
      pageInfo: pageInfo,
    };

    if (data.pageInfo.currentPage > data.pageInfo.totalPages) {
      return next(
        new CustomError(
          "404",
          "Page limit exceeded, No records found!",
          data.pageInfo
        )
      );
    } else {
      responseHandler(res, 200, data, `Applications Retrieved Successfully`);
    }
  } catch (error) {
    next(error);
    return;
  }
};

module.exports = getAllApplications;
