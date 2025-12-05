// src/controllers/movieController.js
const movieService = require('../services/movieService');

// =============================
// GET /movies  (filter, sort, search, pagination)
// =============================
exports.getAllMovies = async (req, res) => {
  try {
    const opts = {
      search: req.query.search,          // cari judul / deskripsi
      genre_id: req.query.genre_id,      // filter by genre_id
      series_id: req.query.series_id,    // filter by series_id
      year: req.query.year,              // YEAR(tanggal_rilis)
      min_duration: req.query.min_duration,
      max_duration: req.query.max_duration,
      sort: req.query.sort,              // judul_asc, tanggal_rilis_desc, dll
      page: req.query.page,
      limit: req.query.limit
    };

    const result = await movieService.getAllMovies(opts);

    res.json({
      success: true,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        returned: result.rows.length
      },
      data: result.rows
    });
  } catch (err) {
    console.error('GetAllMovies Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// =============================
// POST /movies  (insert movie baru)
// =============================
exports.addMovie = async (req, res) => {
  try {
    const { judul, deskripsi, durasi, tanggal_rilis, series_id, genre_id } = req.body;

    // simple validation
    if (!judul || !durasi || !tanggal_rilis) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: judul, durasi, tanggal_rilis'
      });
    }

    const data = {
      judul,
      deskripsi: deskripsi || null,
      durasi,
      tanggal_rilis,
      series_id: series_id || null,
      genre_id: genre_id || null
    };

    const result = await movieService.addMovie(data);

    res.status(201).json({
      success: true,
      message: 'Movie added successfully',
      movie_id: result.insertId
    });
  } catch (err) {
    console.error('AddMovie Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// =============================
// PATCH /movies/:id  (update movie)
// =============================
exports.updateMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const { judul, deskripsi, durasi, tanggal_rilis, series_id, genre_id } = req.body;

    // at least one field must be provided
    if (
      judul === undefined &&
      deskripsi === undefined &&
      durasi === undefined &&
      tanggal_rilis === undefined &&
      series_id === undefined &&
      genre_id === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: 'At least one field must be provided to update'
      });
    }

    const data = {
      judul,
      deskripsi,
      durasi,
      tanggal_rilis,
      series_id,
      genre_id
    };

    const result = await movieService.updateMovie(movieId, data);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.json({
      success: true,
      message: 'Movie updated successfully'
    });
  } catch (err) {
    console.error('UpdateMovie Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// =============================
// DELETE /movies/:id  (delete movie)
// =============================
exports.deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;

    const result = await movieService.deleteMovie(movieId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (err) {
    console.error('DeleteMovie Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};
