import MyDatePicker from '@/components/MyDatePicker';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import { EOperatorType } from '@/components/Table/constant';
import { EKieuHienThi, ETrangThaiMuonSach } from '@/services/SachTaiLieu/constant';
import { exportThongKeTheMuon } from '@/services/SachTaiLieu/MuonSach';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Checkbox, Col, Form, Modal, Radio, Row } from 'antd';
import fileDownload from 'js-file-download';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';

const ModalExportAnPham = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	trangThai: ETrangThaiMuonSach;
}) => {
	const { visible, setVisible, trangThai } = props;
	const [form] = Form.useForm();
	const intl = useIntl();
	const [loadingExport, setLoadingExport] = useState<boolean>(false);
	const kieuXuatDuLieu: EKieuHienThi = Form.useWatch('kieuXuatDuLieu', form);

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		} else {
			form.setFieldsValue({
				kieuXuatDuLieu: EKieuHienThi.NAM,
			});
		}
	}, [visible]);

	const onFinish = (value: any) => {
		let dateRangeFrom, dateRangeTo;

		if (kieuXuatDuLieu === EKieuHienThi.NAM) {
			dateRangeFrom = moment(value.thoiGianXuat).startOf('year').toISOString();
			dateRangeTo = moment(value.thoiGianXuat).endOf('year').toISOString();
		} else if (kieuXuatDuLieu === EKieuHienThi.THANG) {
			dateRangeFrom = moment(value.thoiGianXuat).startOf('month').toISOString();
			dateRangeTo = moment(value.thoiGianXuat).endOf('month').toISOString();
		} else {
			dateRangeFrom = moment(value.thoiGianXuat[0]).startOf('day').toISOString();
			dateRangeTo = moment(value.thoiGianXuat[1]).endOf('day').toISOString();
		}

		const filter = [
			{
				active: true,
				field: trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ? 'thoiGianMuon' : 'thoiGianTra',
				operator: EOperatorType.BETWEEN,
				values: [dateRangeFrom, dateRangeTo],
			},
		];

		setLoadingExport(true);
		exportThongKeTheMuon({
			condition: { quaHan: value.quaHan },
			filters: filter,
		})
			.then((res) => {
				fileDownload(res.data, 'Thống thuê mượn ấn phẩm.xlsx');
			})
			.finally(() => {
				setLoadingExport(false);
			});
	};

	return (
		<Modal title='Xuất dữ liệu thống kê ấn phẩm' visible={visible} onCancel={() => setVisible(false)} footer={null}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col xs={24}>
						<Form.Item name='kieuXuatDuLieu' label='Kiểu xuất dữ liệu' rules={[...rules.required]}>
							<Radio.Group
								options={[
									{ value: EKieuHienThi.NAM, label: 'Năm' },
									{ value: EKieuHienThi.THANG, label: 'Tháng' },
									{ value: EKieuHienThi.NGAY, label: 'Ngày' },
								]}
								onChange={() => form.resetFields(['thoiGianXuat'])}
							/>
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='thoiGianXuat' label='Thời gian' rules={[...rules.required]}>
							{kieuXuatDuLieu === EKieuHienThi.NAM ? (
								<MyDatePicker pickerStyle={'year'} format={'YYYY'} />
							) : kieuXuatDuLieu === EKieuHienThi.THANG ? (
								<MyDatePicker pickerStyle={'month'} format={'MM/YYYY'} />
							) : (
								<MyDateRangePicker />
							)}
						</Form.Item>
					</Col>

					{trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ? (
						<Col xs={24}>
							<Form.Item name='quaHan' valuePropName='checked' initialValue={false}>
								<Checkbox>Chỉ xuất dữ liệu ấn phẩm quá hạn</Checkbox>
							</Form.Item>
						</Col>
					) : null}
				</Row>

				<div className='form-footer'>
					<Button loading={loadingExport} htmlType='submit' type='primary'>
						Xác nhận
					</Button>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalExportAnPham;
