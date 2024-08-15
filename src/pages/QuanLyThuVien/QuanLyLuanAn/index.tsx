import { ELoaiDotQuanLyThuvien } from '@/services/QuanLyThuVien/constants';
import QuanLyThuVienPage from '..';

const QuanLyLuanAnPage = () => {
	return <QuanLyThuVienPage loai={ELoaiDotQuanLyThuvien.LUAN_AN} />;
};

export default QuanLyLuanAnPage;
