import MyDatePicker from '@/components/MyDatePicker';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import { EOperatorType } from '@/components/Table/constant';
import FormItemKhoaNganh from '@/pages/DaoTao/KhoaNganh/FormItemKhoaNganh';
import SelectLopHanhChinhDebounce from '@/pages/DaoTao/LopHanhChinh/Select';
import { EKieuHienThi, ETrangThaiMuonSach, EVaiTroMuonTra } from '@/services/SachTaiLieu/constant';
import { exportThongKeTheMuon } from '@/services/SachTaiLieu/MuonSach';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Checkbox, Col, Form, Modal, Radio, Row } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';

const ModalExportAnPham = (props: {
	title?: string;
	visible: boolean;
	setVisible: (val: boolean) => void;
	trangThai: ETrangThaiMuonSach;
	vaiTro?: EVaiTroMuonTra;
}) => {
	const { visible, setVisible, trangThai, vaiTro, title } = props;
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
			dateRangeFrom = dayjs(value.thoiGianXuat).startOf('year').toISOString();
			dateRangeTo = dayjs(value.thoiGianXuat).endOf('year').toISOString();
		} else if (kieuXuatDuLieu === EKieuHienThi.THANG) {
			dateRangeFrom = dayjs(value.thoiGianXuat).startOf('month').toISOString();
			dateRangeTo = dayjs(value.thoiGianXuat).endOf('month').toISOString();
		} else {
			dateRangeFrom = dayjs(value.thoiGianXuat[0]).startOf('day').toISOString();
			dateRangeTo = dayjs(value.thoiGianXuat[1]).endOf('day').toISOString();
		}

		const filter = [
			value.thoiGianXuat
				? {
						active: true,
						field: trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ? 'thoiGianMuon' : 'thoiGianTra',
						operator: EOperatorType.BETWEEN,
						values: [dateRangeFrom, dateRangeTo],
					}
				: undefined,
			value.maKhoaNganh?.length
				? {
						active: true,
						field: 'maKhoaNganh',
						operator: EOperatorType.INCLUDE,
						values: value.maKhoaNganh,
					}
				: undefined,

			value.tenLopHanhChinh?.length
				? {
						active: true,
						field: ['phieuMuonTra', 'tenLopHanhChinh'],
						operator: EOperatorType.INCLUDE,
						values: value.tenLopHanhChinh,
					}
				: undefined,
		];

		setLoadingExport(true);
		exportThongKeTheMuon({
			condition: { quaHan: value.quaHan, vaiTro, trangThai },
			filters: filter?.filter(Boolean),
		})
			.then((res) => {
				fileDownload(
					res.data,
					trangThai === ETrangThaiMuonSach.DANG_THUE_MUON
						? intl.formatMessage({ id: 'sachtailieu.thongkeanpham.filename.muon' })
						: intl.formatMessage({ id: 'sachtailieu.thongkeanpham.filename.tra' }),
				);
			})
			.finally(() => {
				setLoadingExport(false);
			});
	};

	return (
		<Modal
			title={title ?? intl.formatMessage({ id: 'sachtailieu.thongkeanpham.modal.title.anpham' })}
			open={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={vaiTro === EVaiTroMuonTra.SINHVIEN ? 1100 : 600}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col xs={24}>
						<Form.Item
							name='kieuXuatDuLieu'
							label={intl.formatMessage({ id: 'sachtailieu.thongkeanpham.modal.label.kieuxuat' })}
							rules={[...rules.required]}
						>
							<Radio.Group
								options={[
									{ value: EKieuHienThi.NAM, label: intl.formatMessage({ id: 'sachtailieu.thongkeanpham.radio.nam' }) },
									{
										value: EKieuHienThi.THANG,
										label: intl.formatMessage({ id: 'sachtailieu.thongkeanpham.radio.thang' }),
									},
									{
										value: EKieuHienThi.NGAY,
										label: intl.formatMessage({ id: 'sachtailieu.thongkeanpham.radio.ngay' }),
									},
								]}
								onChange={() => form.resetFields(['thoiGianXuat'])}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={vaiTro === EVaiTroMuonTra.SINHVIEN ? 12 : 24}>
						<Form.Item
							name='thoiGianXuat'
							label={intl.formatMessage({ id: 'sachtailieu.thongkeanpham.modal.label.thoigian' })}
						>
							{kieuXuatDuLieu === EKieuHienThi.NAM ? (
								<MyDatePicker pickerStyle={'year'} format={'YYYY'} allowClear />
							) : kieuXuatDuLieu === EKieuHienThi.THANG ? (
								<MyDatePicker pickerStyle={'month'} format={'MM/YYYY'} allowClear />
							) : (
								<MyDateRangePicker allowClear />
							)}
						</Form.Item>
					</Col>

					{vaiTro === EVaiTroMuonTra.SINHVIEN ? (
						<Col xs={24} md={12}>
							<Form.Item
								name='tenLopHanhChinh'
								label={intl.formatMessage({ id: 'sachtailieu.thongkeanpham.modal.label.lophanhchinh' })}
							>
								<SelectLopHanhChinhDebounce multiple selectMa />
							</Form.Item>
						</Col>
					) : null}

					{trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ? (
						<Col xs={24}>
							<Form.Item name='quaHan' valuePropName='checked' initialValue={false}>
								<Checkbox>{intl.formatMessage({ id: 'sachtailieu.thongkeanpham.modal.checkbox.quahan' })}</Checkbox>
							</Form.Item>
						</Col>
					) : null}

					{vaiTro === EVaiTroMuonTra.SINHVIEN ? (
						<Col xs={24}>
							<Form.Item
								name='maKhoaNganh'
								label={
									<div className='fw500'>
										{intl.formatMessage({ id: 'sachtailieu.thongkeanpham.modal.label.danhsachkhoanganh' })}
									</div>
								}
							>
								<FormItemKhoaNganh />
							</Form.Item>
						</Col>
					) : null}
				</Row>

				<div className='form-footer'>
					<Button loading={loadingExport} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'sachtailieu.thongkeanpham.button.xacnhan' })}
					</Button>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalExportAnPham;
