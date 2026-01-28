import MyDatePicker from '@/components/MyDatePicker';
import { ELoaiDotQuanLyThuvien } from '@/services/QuanLyThuVien/constants';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormQuanLyDot = (props: { afterAddNew?: (rec: QuanLyThuVien.IQuanLyDot) => void; getData: () => void }) => {
	const { afterAddNew, getData } = props;
	const [form] = Form.useForm();
	const intl = useIntl();
	const { edit, record, setRecord, setEdit, formSubmiting, visibleForm, setVisibleForm, putModel, postModel } =
		useModel('quanlythuvien.quanlydot');
	const thoiGianBatDau: Date = Form.useWatch('thoiGianBatDau', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: QuanLyThuVien.IQuanLyDot) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values, getData, false)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col xs={24} md={24}>
					<Form.Item
						name='tenDot'
						label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.tenDot' })}
						rules={[...rules.required]}
					>
						<Input placeholder={intl.formatMessage({ id: 'luananluanvankhoaluan.label.tenDot' })} />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='loai'
						label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.loai' })}
						rules={[...rules.required]}
					>
						<Select
							placeholder={intl.formatMessage({ id: 'luananluanvankhoaluan.label.loai' })}
							options={Object.values([ELoaiDotQuanLyThuvien.LUAN_VAN, ELoaiDotQuanLyThuvien.KHOA_LUAN]).map((item) => ({
								value: item,
								label: item,
							}))}
						/>
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='thoiGianBatDau'
						label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.thoiGianBatDau' })}
						rules={[...rules.required]}
					>
						<MyDatePicker
							onChange={() => form.validateFields(['thoiGianKetThuc'])}
							format='DD/MM/YYYY HH:mm'
							showTime
						/>
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='thoiGianKetThuc'
						label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.thoiGianKetThuc' })}
						rules={[
							...rules.required,
							...rules.sauNgay(
								thoiGianBatDau,
								intl.formatMessage({ id: 'luananluanvankhoaluan.label.thoiGianBatDau' }),
							),
						]}
					>
						<MyDatePicker
							format='DD/MM/YYYY HH:mm'
							showTime
							disabledDate={(cur) => dayjs(cur).isBefore(thoiGianBatDau)}
						/>
					</Form.Item>
				</Col>
				<Col xs={24} md={24}>
					<Form.Item name='ghiChu' label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.ghiChu' })}>
						<Input.TextArea rows={3} placeholder={intl.formatMessage({ id: 'luananluanvankhoaluan.label.ghiChu' })} />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit
						? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
						: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormQuanLyDot;
