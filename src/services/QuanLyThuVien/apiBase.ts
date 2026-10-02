import { ip3, ipDaoTao } from '@/utils/ip';

// Dùng BE dev đã cấu hình cho LA/LV/KL; giữ host đào tạo khi không có override.
export const ipLaLvKl =
	typeof APP_CONFIG_IP_THU_VIEN === 'string' && APP_CONFIG_IP_THU_VIEN.trim() ? ip3 : ipDaoTao;
