export interface MonthlyCategoryRequest {
    userId: string;
    date: string | null;
};

export interface MonthlyCategoryResponse {
    incomes: {
        is_expense: boolean;
    amount: number;
    name: string;
    primary_color: string;
    }[];
    expenses: {
        is_expense: boolean;
    amount: number;
    name: string;
    primary_color: string;
    }[];

}
