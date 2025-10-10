import axiosClient from "axios";

/**
 * Creates an axios instance specifically for AI Server endpoints
 */
const aiInstance = axiosClient.create({
    baseURL: (import.meta.env.VITE_AI_SERVER_URL as string) || 'http://localhost:3005',
    withCredentials: true,
    timeout: 30000 // 30 seconds timeout for AI requests
});

// Request interceptor
aiInstance.interceptors.request.use(
    function (config) {
        // Add any AI-specific headers here
        if (!config.headers.Accept) {
            config.headers.Accept = "application/json";
        }
        
        // Add content type for form data
        if (config.data instanceof FormData) {
            config.headers["Content-Type"] = "multipart/form-data";
        } else if (!config.headers["Content-Type"]) {
            config.headers["Content-Type"] = "application/json; charset=utf-8";
        }
        
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Response interceptor
aiInstance.interceptors.response.use(
    (response) => {
        // Return the full response for AI endpoints
        return response;
    },
    async (error) => {
        // Handle AI server specific errors
        if (error.response) {
            const { status, data } = error.response;
            
            switch (status) {
                case 401:
                    console.error('AI Server: Unauthorized access');
                    break;
                case 403:
                    console.error('AI Server: Forbidden - No permission to access this endpoint');
                    break;
                case 404:
                    console.error('AI Server: Endpoint not found');
                    break;
                case 429:
                    console.error('AI Server: Rate limit exceeded');
                    break;
                case 500:
                    console.error('AI Server: Internal server error');
                    break;
                default:
                    console.error(`AI Server: Error ${status}`, data);
            }
        } else if (error.request) {
            console.error('AI Server: Network error - Server unreachable');
        } else {
            console.error('AI Server: Request setup error', error.message);
        }
        
        return Promise.reject(error);
    }
);

export default aiInstance;
