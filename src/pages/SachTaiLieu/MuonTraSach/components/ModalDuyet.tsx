import { ETrangThaiDuyeMuonSach } from '@/services/SachTaiLieu/constant';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, message, Modal } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormDuyet from './FormDuyet';

const ModalDuyet = (props: { visibleForm: boolean; setVisibleForm: (val: boolean) => void; getData?: () => void }) => {
	const intl = useIntl();
	const { visibleForm, setVisibleForm, getData: getDataExternal } = props;
	const [form] = Form.useForm();
	const { record: recAnPham, xuLyThueMuonAnPhamModel, formSubmiting } = useModel('sachtailieu.muontra.muontra');

	const { selectedIds, setSelectedIds, danhSach } = useModel('sachtailieu.anpham.thongtinanpham');

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setSelectedIds([]);
		}
	}, [visibleForm]);

	const onFinish = async (values: any) => {
		if (!selectedIds?.length) {
			message.error('Vui lòng chọn thông tin ấn phẩm cho mượn!');
			return;
		}
		const data = {
			...values,
			trangThaiDuyet: ETrangThaiDuyeMuonSach.DA_DUYET,
			thoiGianMuon: moment().toISOString(),
			soDangKyCaBiet: danhSach
				?.find((item) => item?._id === selectedIds[0])
				?.thuocTinhAnPham?.find((item) => item?.code === '$j')?.value,
		};
		xuLyThueMuonAnPhamModel(recAnPham?._id ?? '', data as any, getDataExternal)
			.then(() => {
				setVisibleForm(false);
			})
			.catch((err) => console.log(err));
	};

	return (
		<Modal
			title='Xác nhận duyệt cho mượn ấn phẩm'
			visible={visibleForm}
			onCancel={() => setVisibleForm(false)}
			width={800}
			footer={null}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<FormDuyet form={form} />

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Xác nhận
					</Button>

					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalDuyet;
