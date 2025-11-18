import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    RangeNum,
    TreeHoleType,
    StatisticsType,
    QueryParams,
    ApiResponse,
    LoginResponse,
    AishType
} from '../interface';
import { navigate } from '../utils/navigationRef';
    
// 根据文档，服务器地址为 http://115.190.240.212:80
const baseURL = 'http://115.190.240.212';

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
        // 注意：根据文档，认证使用 Cookie，不需要设置 Authorization header
        // withCredentials: true 已经设置，会自动发送 Cookie
        this.instance.interceptors.request.use(
            async (config) => {
                // 可以在这里添加其他请求头或处理逻辑
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
                    // 清除本地存储的认证信息
                    await AsyncStorage.removeItem('userInfo');
                    await AsyncStorage.removeItem('userToken');
                    await AsyncStorage.removeItem('userData');
                    this.authToken = '';
                    // 跳转到登录页
                    navigate('Login');
                    // 拒绝响应，避免调用方继续处理
                    return Promise.reject(new Error('未授权，请重新登录'));
                }
                return response;
            },
            async (error) => {
                console.log('API Error:', error);
                // 处理HTTP状态码401
                if (error.response && error.response.status === 401) {
                    // 清除本地存储的认证信息
                    await AsyncStorage.removeItem('userInfo');
                    await AsyncStorage.removeItem('userToken');
                    await AsyncStorage.removeItem('userData');
                    this.authToken = '';
                    // 跳转到登录页
                    navigate('Login');
                }
                return Promise.reject(error);
            }
        );
    }

    // 认证相关接口
    public login(username: string, password: string): Promise<AxiosResponse<LoginResponse>> {
        return this.instance.post<LoginResponse>(
            '/api/auth/login',
            {
                username,
                password,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    public logout(): Promise<AxiosResponse<{ code: number; msg: string }>> {
        return this.instance.post<{ code: number; msg: string }>('/api/auth/logout');
    }

    // 树洞相关接口
    public fetchAllTreeHole(params: QueryParams): Promise<AxiosResponse<ApiResponse<TreeHoleType>>> {
        const queryParams: any = {
            page: params.page,
            size: params.size,
        };
        
        if (params.field) {
            queryParams.field = params.field;
        }
        
        if (params.sort) {
            queryParams.sort = params.sort;
        }
        
        if (params.likeRange && params.likeRange !== RangeNum.NoLimit) {
            queryParams.likeRange = params.likeRange;
        }
        
        return this.instance.get<ApiResponse<TreeHoleType>>(
            '/api/treehole',
            { params: queryParams }
        );
    }

    public findByAuthor(author: string): Promise<AxiosResponse<ApiResponse<TreeHoleType>>> {
        return this.instance.get<ApiResponse<TreeHoleType>>(
            `/api/treehole/author/${encodeURIComponent(author)}`
        );
    }

    public searchTreeHole(keyword: string): Promise<AxiosResponse<ApiResponse<TreeHoleType>>> {
        return this.instance.get<ApiResponse<TreeHoleType>>(
            '/api/treehole/search',
            { params: { q: keyword } }
        );
    }

    public fetchStatistics(): Promise<AxiosResponse<ApiResponse<StatisticsType>>> {
        return this.instance.get<ApiResponse<StatisticsType>>('/api/treehole/static');
    }

    // AISH 相关接口
    public fetchAish123(): Promise<AxiosResponse<ApiResponse<AishType>>> {
        return this.instance.get<ApiResponse<AishType>>('/api/aish/posts');
    }

    // Agent 相关接口
    public queryAi(prompt: string, model?: string): Promise<AxiosResponse<any>> {
        // 根据文档，豆包 Agent 接口使用 OpenAI 兼容格式
        const data = {
            model: model || 'ep-20241208123456-abcde', // 默认模型，可以根据需要修改
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        };
        return this.instance.post('/api/agent/doubao', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // 文心一言接口（如果服务器支持）
    public queryWenXin(prompt: string): Promise<AxiosResponse<any>> {
        // 注意：文档中没有文心一言接口，这里保留原有逻辑
        // 如果服务器不支持，可能需要删除或修改此方法
        return this.instance.post('/api/agent/qwen', {
            prompt,
        });
    }
}

export const apiService = new ApiService();