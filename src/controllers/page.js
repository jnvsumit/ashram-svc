const { Page } = require('../persistence/models');
const { v4: uuidv4 } = require('uuid');

const postPage = async (req, res) => {
  const { bookId } = req.params;
  const { content, title } = req.body;
  const { userId } = req.user;

  try {
    const page = new Page({
      pageId: uuidv4(),
      bookId,
      userId,
      title,
      content,
    });

    await page.save();

    return res.status(201).json({
      message: 'Page updated',
      messageCode: 'SUCCESS',
      status: 201,
      data: {
        pageId: page.pageId,
        bookId: page.bookId,
        title: page.title,
        content: page.content
      },
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
      messageCode: 'InternalServerError',
      status: 500,
      success: false,
    });
  }
}

const updatePage = async (req, res) => {
  const { pageId } = req.params;
  const { content, title } = req.body;
  const userId = req.userId;

  console.log(content, title);

  try {
    let page = await Page.findOne({ pageId });

    if (!page) {
      return res.status(404).json({
        message: 'Not Found',
        messageCode: 'NOT_FOUND',
        status: 404,
        data: null,
        success: false,
      });
    }

    const updateObj = { userId };

    if (content) {
      updateObj.content = content;
    }

    if (title) {
      updateObj.title = title;
    }

    page = await Page.findOneAndUpdate({ pageId }, updateObj, { new: true });

    return res.status(200).json({
      message: 'Page updated',
      messageCode: 'SUCCESS',
      status: 200,
      data: page,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
      messageCode: 'INTERNAL_SERVER_ERROR',
      status: 500,
      data: null,
      success: false,
    });
  }
};

const getPage = async (req, res) => {
    const { pageId } = req.params;
  
    try {
      const page = await Page.findOne({ pageId });
  
      if (!page) {
        return res.status(404).json({
          message: 'Page not found',
          messageCode: 'NotFoundError',
          status: 404,
          success: false
        });
      }
  
      return res.status(200).json({
        message: 'Page fetched',
        messageCode: 'SUCCESS',
        status: 200,
        data: {
          pageId: page.pageId,
          bookId: page.bookId,
          content: page.content,
          title: page.title,
          userId: page.userId
        },
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Internal server error',
        messageCode: 'InternalServerError',
        status: 500,
        success: false,
      });
    }
  };
  

  const getPages = async (req, res) => {
    const { bookId } = req.params;
    let { pageNumber, pageSize } = req.query;
  
    // Set default values for pageNumber and pageSize if not provided
    pageNumber = pageNumber ? parseInt(pageNumber) : 1;
    pageSize = pageSize ? parseInt(pageSize) : 10;
  
    try {
      // Validate pageNumber and pageSize values
      if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
        throw new Error('Invalid pageNumber or pageSize values');
      }
  
      // Calculate skip and limit values based on pageNumber and pageSize
      const skip = (pageNumber - 1) * pageSize;
      const limit = pageSize;
  
      // Retrieve pages from database based on bookId and pagination
      const pages = await Page.find({ bookId }).skip(skip).limit(limit);
  
      // Count the total number of pages for the book
      const totalPageCount = await Page.countDocuments({ bookId });
  
      return res.status(200).json({
        status: 200,
        messageCode: 'SUCCESS',
        message: 'Pages fetched successfully',
        data: {
          bookId,
          pages: pages.map((page) => ({
            pageId: page.pageId,
            title: page.title,
            userId: page.userId,
          })),
          pageNumber,
          pageSize,
          totalPages: Math.ceil(totalPageCount / pageSize),
        },
        success: true,
      });
    } catch (error) {
      console.error('Error fetching pages:', error);
  
      return res.status(400).json({
        status: 400,
        messageCode: 'BAD_REQUEST',
        message: error.message,
        data: null,
        success: false,
      });
    }
  };

  const deletePage = async (req, res) => {
    const { pageId } = req.params;
  
    try {
      const page = await Page.findOne({ pageId });
  
      if (!page) {
        console.log("Page not found");
        return res.status(404).json({
          message: 'Page not found',
          messageCode: 'NotFoundError',
          status: 404,
          success: false
        });
      }

      await Page.deleteOne({ pageId });
  
      return res.status(200).json({
        message: 'Page deleted',
        messageCode: 'SUCCESS',
        status: 200,
        data: {
          pageId: page.pageId,
          bookId: page.bookId,
          content: page.content,
          title: page.title,
          userId: page.userId
        },
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Internal server error',
        messageCode: 'InternalServerError',
        status: 500,
        success: false,
      });
    }
  }
  

module.exports = {
    updatePage,
    getPage,
    getPages,
    postPage,
    deletePage
};