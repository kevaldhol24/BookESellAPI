import { Request, Response } from "express";
import { baseController } from "../base/controller";
import { BookService } from "./book.service";
import { BookModel } from "./book.model";

export class BookController {
  constructor(private readonly bookService: BookService) {
    this.bookService = bookService;
  }

  public getBooks = async (req: Request, res: Response): Promise<Response> => {
    const { pageIndex, pageSize, keyword } = req.query;
    return this.bookService
      .getBooks(
        Number(pageSize),
        Number(pageIndex),
        keyword ? String(keyword) : ""
      )
      .then((result) => baseController.sendResult(res, result))
      .catch((e: Error) => {
        return baseController.sendErrorResult(res);
      });
  };

  public getAllBooks = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    return this.bookService
      .getAllBooks()
      .then((result) => baseController.sendResult(res, result))
      .catch((e: Error) => {
        return baseController.sendErrorResult(res);
      });
  };

  public updateBook = async (
    req: Request<{}, {}, BookModel>,
    res: Response
  ): Promise<Response> => {
    const book = req.body;
    return this.bookService
      .updateBook(book)
      .then((result) => {
        return baseController.sendResult(res, result);
      })
      .catch((e: Error) => {
        return baseController.sendErrorResult(res);
      });
  };

  public createBook = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const book = req.body;
    return this.bookService
      .createBook(book)
      .then((result) => {
        return baseController.sendResult(res, result);
      })
      .catch((e: Error) => {
        return baseController.sendErrorResult(res);
      });
  };

  public deleteBook = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { id } = req.query;

    return this.bookService
      .deleteBook(Number(id))
      .then((result) => {
        return baseController.sendResult(res, result);
      })
      .catch((e: Error) => {
        return baseController.sendErrorResult(res);
      });
  };

  public searchBook = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { keyword } = req.query;
    return this.bookService
      .searchBook(String(keyword ?? ""))
      .then((result) => baseController.sendResult(res, result))
      .catch((e: Error) => {
        return baseController.sendErrorResult(res);
      });
  };
}
