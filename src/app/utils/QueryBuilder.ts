import { Query } from "mongoose";
import { excludedFields } from "../constant";

export class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public query: Record<string, string>;

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    filter(): this {
        const filter = { ...this.query };

        for (const field of excludedFields) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete filter[field];
        };
        if (Object.keys(filter).length) {
            this.modelQuery = this.modelQuery.find(filter);
        }

        return this;
    }

    search(searchAbleFields: string[]): this {
        const searchTerm = this.query.searchTerm || "";

        if (searchTerm) {
            const searchQuery = {
                $or: searchAbleFields.map(field => ({
                    [field]: { $regex: searchTerm, $options: "i" }
                }))
            };
            this.modelQuery = this.modelQuery.find(searchQuery);
        }

        return this;
    }

    sort() {
        const sort = this.query.sort || "createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;

        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }

    build() {
        return this.modelQuery;
    }
    async getMeta() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const totalDocuments = await this.modelQuery.model.countDocuments();
        const totalPage = Math.ceil(totalDocuments / limit);

        return { page, limit, totalPage, total: totalDocuments };
    }
}