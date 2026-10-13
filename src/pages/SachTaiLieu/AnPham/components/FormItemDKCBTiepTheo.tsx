import { getSoDangKyCaBietCuoi } from '@/services/SachTaiLieu/AnPham';
import { Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';

/** Số ĐKCB dự kiến cấp tiếp theo của kho, chỉ để xem; hệ thống tự cấp số khi xếp giá */
const FormItemDKCBTiepTheo = (props: { maKhoSach?: string }) => {
	const intl = useIntl();
	const [soDKCBTiepTheo, setSoDKCBTiepTheo] = useState<string>();

	useEffect(() => {
		setSoDKCBTiepTheo(undefined);
		// Đổi kho liên tục thì bỏ qua kết quả của kho cũ trả về sau
		let daDoiKho = false;
		if (props.maKhoSach)
			getSoDangKyCaBietCuoi(props.maKhoSach)
				.then((res) => {
					if (!daDoiKho) setSoDKCBTiepTheo(res.data?.data?.soDangKyCaBietTiepTheo);
				})
				.catch((er) => console.log(er));
		return () => {
			daDoiKho = true;
		};
	}, [props.maKhoSach]);

	return (
		<Form.Item
			label={intl.formatMessage({ id: 'sachtailieu.anpham.dkcbDuKien' })}
			extra={intl.formatMessage({ id: 'sachtailieu.anpham.moTaDKCBDuKien' })}
		>
			<Input value={soDKCBTiepTheo} disabled />
		</Form.Item>
	);
};

export default FormItemDKCBTiepTheo;
