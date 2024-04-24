export const errorFormatter = (error) => {
  const graphQLFormattedError = {
    success: false,
    message: error.message,
    error: error.extensions?.error || error.extensions?.originalError || 'Internal Server Error!',
    statusCode: error.extensions?.statusCode || error.extensions?.originalError?.statusCode || 500
  };
  return graphQLFormattedError;
};
