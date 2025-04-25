export interface CategoryRepo {
    GETmonthlyCategory(props: {userId: string, start:string, end:string}): Promise<{is_expense: boolean, amount:number, category:{name: string, primary_color: string}[]}[] | []>;
  }