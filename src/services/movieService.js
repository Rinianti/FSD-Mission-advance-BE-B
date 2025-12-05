// src/services/movieService.js
const db = require("../db"); // pool.promise()

/**
 * Get all movies with filter, sort, search, pagination
 * opts: {
 *   search, genre_id, series_id, year,
 *   min_duration, max_duration,
 *   sort, page, limit
 * }
 */
exports.getAllMovies = async (opts = {}) => {
  const {
    search,
    genre_id,
    series_id,
    year,
    min_duration,
    max_duration,
    sort,
    page = 1,
    limit = 10
  } = opts;

  const where = [];
  const params = [];

  // Search (judul OR deskripsi)
  if (search) {
    where.push("(judul LIKE ? OR deskripsi LIKE ?)");
    const like = `%${search}%`;
    params.push(like, like);
  }

  // Filters
  if (genre_id) {
    where.push("genre_id = ?");
    params.push(genre_id);
  }
  if (series_id) {
    where.push("series_id = ?");
    params.push(series_id);
  }
  if (year) {
    // filter by year from tanggal_rilis
    where.push("YEAR(tanggal_rilis) = ?");
    params.push(year);
  }
  if (min_duration) {
    where.push("durasi >= ?");
    params.push(min_duration);
  }
  if (max_duration) {
    where.push("durasi <= ?");
    params.push(max_duration);
  }

  // Build WHERE clause
  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  // SORT mapping (safe fields only)
  const sortMap = {
    judul_asc: "judul ASC",
    judul_desc: "judul DESC",
    tanggal_rilis_asc: "tanggal_rilis ASC",
    tanggal_rilis_desc: "tanggal_rilis DESC",
    durasi_asc: "durasi ASC",
    durasi_desc: "durasi DESC",
    movie_id_asc: "movie_id ASC",
    movie_id_desc: "movie_id DESC"
  };

  const orderBy =
    sort && sortMap[sort]
      ? `ORDER BY ${sortMap[sort]}`
      : `ORDER BY movie_id DESC`;

  // Pagination
  const lim = Number(limit) > 0 ? Number(limit) : 10;
  const pg = Number(page) > 0 ? Number(page) : 1;
  const offset = (pg - 1) * lim;

  // Total count
  const countSql = `SELECT COUNT(*) AS total FROM Movie ${whereClause}`;
  const [[countRow]] = await db.query(countSql, params);
  const total = countRow ? countRow.total : 0;

  // Data query
  const sql = `SELECT * FROM Movie ${whereClause} ${orderBy} LIMIT ? OFFSET ?`;
  const dataParams = params.concat([lim, offset]);
  const [rows] = await db.query(sql, dataParams);

  return { rows, total, page: pg, limit: lim };
};

/**
 * Insert new movie
 * data: { judul, deskripsi, durasi, tanggal_rilis, series_id, genre_id }
 */
exports.addMovie = async (data) => {
  const sql = `
    INSERT INTO Movie (judul, deskripsi, durasi, tanggal_rilis, series_id, genre_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const params = [
    data.judul,
    data.deskripsi,
    data.durasi,
    data.tanggal_rilis,
    data.series_id,
    data.genre_id
  ];

  const [result] = await db.query(sql, params);
  return result; // result.insertId dipakai di controller
};

/**
 * Update movie by id (partial update)
 * data bisa berisi sebagian field saja
 */
exports.updateMovie = async (id, data) => {
  const sql = `
    UPDATE Movie
    SET 
      judul         = COALESCE(?, judul),
      deskripsi     = COALESCE(?, deskripsi),
      durasi        = COALESCE(?, durasi),
      tanggal_rilis = COALESCE(?, tanggal_rilis),
      series_id     = COALESCE(?, series_id),
      genre_id      = COALESCE(?, genre_id)
    WHERE movie_id = ?
  `;

  const params = [
    data.judul ?? null,
    data.deskripsi ?? null,
    data.durasi ?? null,
    data.tanggal_rilis ?? null,
    data.series_id ?? null,
    data.genre_id ?? null,
    id
  ];

  const [result] = await db.query(sql, params);
  return result; // result.affectedRows dipakai di controller
};

/**
 * Delete movie by id
 */
exports.deleteMovie = async (id) => {
  const sql = `DELETE FROM Movie WHERE movie_id = ?`;
  const [result] = await db.query(sql, [id]);
  return result; // result.affectedRows dipakai di controller
};
