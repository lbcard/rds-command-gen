const schema = {
  SHOW: {
    prop: "show",
    type: String,
    required: true,
  },
  DAYS: {
    prop: "days",
    type: String,
    required: true,
  },
  TIMES: {
    prop: "times",
    type: String,
    required: true,
  },
  GENRE: {
    prop: "genre",
    type: Number,
  },
};

module.exports = schema;
