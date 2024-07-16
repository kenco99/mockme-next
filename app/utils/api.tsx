import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const URL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance: AxiosInstance = axios.create({
    baseURL: URL,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('jwt_token');
            if (token && config.headers) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        return response;
    },
    (error: AxiosError): Promise<AxiosError> => {
        if (error.response?.data && (error.response.data as any).code === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('jwt_token');
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

interface QuestionParams {
    sessionId?: string;
    questionId?: string;
}

export const getQuestion = async (params: QuestionParams): Promise<any> => {
    try {
        let url = '/mockme/question';
        if (params.sessionId) {
            url += `?session_id=${params.sessionId}`;
        } else if (params.questionId) {
            url += `?question_id=${params.questionId}`;
        }
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching question:', error);
        throw error;
    }
};

export const submitAnswer = async (option: string, questionId: string): Promise<any> => {
    try {
        const response = await axiosInstance.get(`/mockme/answer?option=${option}&question_id=${questionId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error submitting answer:', error);
        throw error;
    }
};

export const signUp = async (token: string): Promise<any> => {
    try {
        const response = await axiosInstance.post(`/mockme/signup`, { token });
        return response.data;
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
};

interface UserData {
    [key: string]: string | number | boolean;
}

export const updateUserDetails = async (userData: UserData): Promise<any> => {
    try {
        const response = await axiosInstance.put(`/mockme/user`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user details:', error);
        throw error;
    }
};

export const fetchUserData = async (): Promise<any> => {
    try {
        const response = await axiosInstance.get(`/mockme/user`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

export const getSections = async (searchTerm: string = ''): Promise<any> => {
    try {
        const url = searchTerm ? `/mockme/sections?search_section=${searchTerm}` : '/mockme/sections';
        const response = await axiosInstance.get(url);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching sections:', error);
        throw error;
    }
};

export const getTopics = async (searchTerm: string = ''): Promise<any> => {
    try {
        const url = searchTerm ? `/mockme/topics?search_topic=${searchTerm}` : '/mockme/topics';
        const response = await axiosInstance.get(url);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching topics:', error);
        throw error;
    }
};

interface SessionData {
    [key: string]: string | number | boolean | string[];
}

export const createSession = async (sessionData: {
    duration_seconds: number | null;
    topic_ids: number[];
    section_ids: number[];
    number_of_questions: number | null
}): Promise<any> => {
    try {
        const response = await axiosInstance.post('/mockme/session', sessionData);
        return response.data.data;
    } catch (error) {
        console.error('Error creating session:', error);
        throw error;
    }
};

export const getSessions = async (): Promise<any> => {
    try {
        const response = await axiosInstance.get('/mockme/session');
        return response.data;
    } catch (error) {
        console.error('Error fetching sessions:', error);
        throw error;
    }
};

export default axiosInstance;
