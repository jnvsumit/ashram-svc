const uuid = require('uuid').v4;
const { uploadImageToS3, deleteImageFromS3, getSignedUrl} = require('../libs/S3');
const { Book } = require('../persistence/models');
const config = require('../config');

const postBook = async (req, res) => {
  try {
    const { title, authors, description } = req.body;
    const userId = req.user.userId;

    const thumbnail = req.file ? await uploadImageToS3(req.file, uuid()) : config.defaultBookCoverURL;

    const book = new Book({
      userId,
      bookId: uuid(),
      title,
      authors,
      thumbnail,
      description,
    });
    await book.save();
    return res.status(201).json({ 
        message: 'Book created successfully', 
        data: {
            userId,
            bookId: book.bookId,
            title,
            authors,
            thumbnail,
            description
        },
        messageCode: "BOOK_CREATED",
        status: 201,
        success: true
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
        status: 500,
        messageCode: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        success: false
     });
  }
};

const updateBook = async (req, res) => {
    try {
      const { bookId } = req.params;
      const { title, authors, description } = req.body;
      const userId = req.user.userId;
  
      // Check if book exists
      let book = await Book.findOne({ bookId });
  
      if (!book) {
        return res.status(404).json({ 
            message: 'Book not found', 
            data: null,
            messageCode: "NOT_FOUND",
            status: 404,
            success: false
        });
      }

      book.userId = userId;
  
      // Update book fields if provided
      if (title) book.title = title;
      if (authors) book.authors = authors;
      if (req.file) book.thumbnail = await uploadImageToS3(req.file, book.bookId);
      if (description) book.description = description;
  
      // Save updated book to database
      await book.save();
  
      return res.status(200).json({ 
          message: 'Book updated successfully', 
          data: {
              userId: book.userId,
              bookId: book.bookId,
              title: book.title,
              authors: book.authors,
              thumbnail: book.thumbnail,
              description: book.description
          },
          messageCode: "BOOK_UPDATED",
          status: 200,
          success: true
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
          status: 500,
          messageCode: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error',
          success: false
      });
    }
  };

  const deleteBook = async (req, res) => {
    try {
      const userId = req.user.userId;
      const bookId = req.params.bookId;
  
      const book = await Book.findOne({ userId, bookId });
      if (!book) {
        return res.status(404).json({
          messageCode: 'NOT_FOUND',
          message: 'Book not found',
          status: 404,
          success: false
        });
      }
  
      // Delete thumbnail from S3
      await deleteImageFromS3(book.thumbnail);
  
      await Book.deleteOne({ userId, bookId });
      return res.status(200).json({
          message: 'Book deleted successfully',
          data: null,
          messageCode: "",
          status: 200,
          success: true
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
          status: 500,
          messageCode: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error',
          success: false
       });
    }
  };

  const getBook = async (req, res) => {
    try {
      const { bookId } = req.params;
  
      const book = await Book.findOne({ bookId });
  
      if (!book) {
        return res.status(404).json({
          status: 404,
          messageCode: 'BOOK_NOT_FOUND',
          message: 'Book not found',
          success: false
        });
      }
  
      return res.status(200).json({
        message: 'Book found',
        data: {
            userId: book.userId,
            bookId: book.bookId,
            title: book.title,
            authors: book.authors,
            description: book.description,
            thumbnail: book.thumbnail,
        },
        messageCode: "",
        status: 200,
        success: true
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 500,
        messageCode: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        success: false
      });
    }
  };

  const getBooks = async (req, res) => {
    try {
      const pageNumber = req.query.pageNumber ? parseInt(req.query.pageNumber) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
  
      const totalBooks = await Book.countDocuments({});
      const totalPages = Math.ceil(totalBooks / pageSize);
  
      const books = await Book.find()
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);
  
      console.log("Books", books);

      return res.status(200).json({
        message: 'Books fetched successfully',
        data: {
          books: books.map(book => {
            return {
              userId: book.userId,
              bookId: book.bookId,
              title: book.title,
              authors: book.authors,
              thumbnail: book.thumbnail,
              description: book.description
            }
          }),
          pageNumber,
          pageSize,
          totalPages,
          totalBooks,
        },
        messageCode: '',
        status: 200,
        success: true,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 500,
        messageCode: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        success: false,
      });
    }
  };
  

module.exports = {
  postBook,
  updateBook,
  deleteBook,
  getBook,
  getBooks
};
