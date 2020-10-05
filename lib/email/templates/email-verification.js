const template = require("./template");

const content = ({ url }) => `
<tr>
	<td style="padding: 10px 0; max-width: 600px;">
		<b>Dear Ma'am/Sir</b>
	</td>
</tr>
<tr>
  <td style="padding: 10px 0; max-width: 600px;">
		Please verify your email <b><a href="${url}" style="color: #298bf5; text-decoration: none;">here</a></b>.
		If you are unable to click the link copy and paste the following the link into your browser's address bar -
	</td>
</tr>
<tr>
  <td style="padding: 10px 0; max-width: 600px;">
		<span style="color: #456484; word-wrap: break-word;">${url}</span>
	</td>
</tr>
`;

module.exports = ({ url }) =>
  template({ title: "Please verify your email", content: content({ url }) });