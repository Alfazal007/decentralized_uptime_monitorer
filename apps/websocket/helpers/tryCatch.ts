type Success<T> = {
    data: T;
    error: null;
};

type Failure<E> = {
    data: null;
    error: E;
};

export type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatchPromise<T, E = Error>(
    promise: Promise<T>,
): Promise<Result<T, E>> {
    try {
        const data = await promise;
        return { data, error: null };
    } catch (error) {
        return { data: null, error: error as E };
    }
}

export function tryCatch<T, E = Error>(
    functionToRun: () => T,
): Result<T, E> {
    try {
        const data = functionToRun();
        return { data, error: null };
    } catch (error) {
        return { data: null, error: error as E };
    }
}
