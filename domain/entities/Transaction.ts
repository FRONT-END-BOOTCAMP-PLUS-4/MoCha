export class Transaction {
	constructor(
		public id: number,
		public user_id: number,
		public category_id: number,
        public date: string,
        public amount: number,
        public memo: string | null,
        public is_expense: boolean
	) {}
}