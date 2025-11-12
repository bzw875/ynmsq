import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    SortEnum,
    FieldEnum,
    RangeNum,
    TreeHoleType,
    StatisticsType,
    QueryParams,
    ApiResponse,
    UserInfo
} from '../interface';

const baseURL = __DEV__ ? '/api' : '/api';

class ApiService {
    private instance: AxiosInstance;
    private authToken: string = '';

    constructor() {
        this.instance = axios.create({
            baseURL,
            timeout: 100000,
            maxRedirects: 0,
            withCredentials: true,
        });

        this.setupInterceptors();
    }

    // 设置认证token
    setAuthToken(token: string) {
        this.authToken = token;
    }

    // 获取认证token
    getAuthToken(): string {
        return this.authToken;
    }

    private setupInterceptors() {
        // 请求拦截器
        this.instance.interceptors.request.use(
            async (config) => {
                try {
                    // 优先使用显式设置的token
                    if (this.authToken) {
                        config.headers.Authorization = `Bearer ${this.authToken}`;
                    } else {
                        // 其次从AsyncStorage获取
                        const userInfoStr = await AsyncStorage.getItem('userInfo');
                        if (userInfoStr) {
                            const userInfo: UserInfo = JSON.parse(userInfoStr);
                            if (userInfo.token) {
                                config.headers.Authorization = `Bearer ${userInfo.token}`;
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error getting user info from storage:', error);
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // 响应拦截器
        this.instance.interceptors.response.use(
            async (response) => {
                if (response.data.code === 401) {
                    await AsyncStorage.removeItem('userInfo');
                }
                return response;
            },
            (error) => {
                console.log('API Error:', error);
                return Promise.reject(error);
            }
        );
    }

    public fetchAllTreeHole(params: QueryParams): Promise<AxiosResponse<ApiResponse<TreeHoleType>>> {
        const p = {
            ...params,
            likeRange: params.likeRange === RangeNum.NoLimit ? '' : params.likeRange,
            page: String(params.page),
            size: String(params.size),
        };
        return this.instance.get<ApiResponse<TreeHoleType>>(
            `/treehole?${new URLSearchParams(p as any)}`
        );
    }

    public findByAuthor(author: string): Promise<AxiosResponse<ApiResponse<TreeHoleType>>> {
        return this.instance.get<ApiResponse<TreeHoleType>>(
            `/treehole/author/${author}`
        );
    }

    public searchTreeHole(keyword: string): Promise<AxiosResponse<ApiResponse<TreeHoleType>>> {
        return this.instance.get<ApiResponse<TreeHoleType>>(
            `/treehole/search?q=${encodeURIComponent(keyword)}`
        );
    }

    public login(username: string, password: string): Promise<AxiosResponse<any>> {
        return this.instance.get(
            `/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        );
    }

    public fetchStatistics(): Promise<AxiosResponse<ApiResponse<StatisticsType>>> {
        return this.instance.get<ApiResponse<StatisticsType>>('/treehole/static');
    }

    public fetchAish123(): Promise<AxiosResponse<ApiResponse<TreeHoleType>>> {
        return this.instance.get<ApiResponse<TreeHoleType>>('/aish/posts');
    }

    public queryQwen(prompt: string): Promise<AxiosResponse<any>> {
        return this.instance.post('/agent/qwen', {
            prompt,
        });
    }

    public queryAi(prompt: string): Promise<AxiosResponse<any>> {
        const data = {
            model: 'doubao-seed-1-6-flash-250615',
            messages: [
                {
                    content: [
                        {
                            text: prompt,
                            type: 'text',
                        },
                    ],
                    role: 'user',
                },
            ],
            stream: false,
        };
        return this.instance.post('/agent/doubao', data);
    }
}

export const apiService = new ApiService();