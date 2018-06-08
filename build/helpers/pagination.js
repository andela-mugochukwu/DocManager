"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var pagination = function pagination(payload, params) {
  return {
    page: parseInt(params.offset / params.limit, 10) + 1,
    pageCount: Math.ceil(payload.count / params.limit),
    pageSize: payload.rows.length < 8 ? payload.rows.length : 8
  };
};
exports.default = pagination;