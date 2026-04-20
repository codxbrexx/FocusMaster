const { ZodError } = require("zod");

const formatIssues = (issues) =>
  issues.map((issue) => ({
    field: issue.path.join(".") || "root",
    message: issue.message,
  }));

const validate =
  ({ body, params, query }) =>
  (req, res, next) => {
    try {
      if (body) {
        req.body = body.parse(req.body);
      }

      if (params) {
        req.params = params.parse(req.params);
      }

      if (query) {
        req.query = query.parse(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: formatIssues(error.issues),
        });
      }

      next(error);
    }
  };

module.exports = { validate };
