<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td,
        th {
            border: 1px solid #000;
            padding: 4px;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .font-bold {
            font-weight: bold;
        }

        .mb-4 {
            margin-bottom: 12px;
        }
    </style>
</head>

<body>

    {{-- Title --}}
    <div class="text-center mb-4">
        <h1 style="color:#c2410c;">GRANITE TABLE</h1>
        <div style="font-size:16px; margin-top:-15px;">PREVENTIVE MAINTENANCE CHECKLIST</div>
    </div>

    {{-- Header --}}
    <table class="mb-4" style="width:56%;">
        @php
        $headers = [
        'MACHINE NUMBER' => $granite->equipment,
        'CONTROL NUMBER' => $granite->control_no,
        'SERIAL NUMBER' => $granite->serial_no,
        'PERFORMED BY' => $granite->performed_by,
        'DATE PERFORMED' => $granite->date_performed,
        'DUE DATE' => $granite->due_date,
        ];
        @endphp

        @foreach($headers as $label => $value)
        <tr>
            <td style="width:35%;" class="font-bold">{{ $label }} :</td>
            <td>{{ $value ?: ' ' }}</td>
        </tr>
        @endforeach
    </table>

    <p class="font-bold mb-4">
        REFERENCE PM PROCEDURE SPECIFICATION : TFP05-001
    </p>

    {{-- Checklist --}}
    <table class="mb-4">
        <thead>
            <tr class="text-center font-bold">
                <th>NO.</th>
                <th>ASSEMBLY ITEM</th>
                <th>REQUIREMENTS</th>
                <th>ACTIVITY</th>
                <th>ACTUAL</th>
                <th>FREQ</th>
                <th>REMARKS</th>
            </tr>
        </thead>
        <tbody>
            @foreach($procedureSpecs as $i => $row)
            <tr>
                <td class="text-center">{{ $i + 1 }}</td>
                <td>{{ $row['item'] ?? '' }}</td>
                <td>{{ $row['req'] ?? '' }}</td>
                <td class="text-center">{{ $row['activity'] ?? '' }}</td>
                <td class="text-center">{{ $row['actual'] ?? '' }}</td>
                <td class="text-center">{{ $row['freq'] ?? '' }}</td>
                <td class="text-center">{{ $row['remarks'] ?? '' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    {{-- Flatness --}}
    <h4 class="text-center font-bold mb-4">FLATNESS INSPECTION DETAILS</h4>

    <table class="mb-4">
        <thead>
            <tr class="text-center font-bold">
                <th>NO.</th>
                <th>FLATNESS CHECK (Granite Grade B)</th>
                <th>IMAGE REFERENCE</th>
                <th>REQUIRED VALUE</th>
                <th>ACTUAL</th>
                <th>RESULT</th>
                <th>REMARKS</th>
            </tr>
        </thead>
        <tbody>
            @foreach($flatness as $i => $row)
            <tr>
                <td class="text-center">{{ $row['no'] ?? $i+1 }}</td>
                <td>{{ $row['point'] ?? '' }}</td>

                @if($i === 0)
                <td rowspan="5" class="text-center">
                    <img src="{{ public_path('images/granite_image.png') }}" height="90">
                </td>
                @endif

                <td class="text-center">{{ $row['required'] ?? '' }}</td>
                <td class="text-center">{{ $row['actual'] ?? '' }}mm</td>
                <td class="text-center">{{ $row['result'] ?? '' }}</td>
                <td class="text-center">{{ $row['remarks'] ?? '' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    {{-- Verification --}}
    <table style="width:50%; margin-left:auto;" class="mb-4">
        <tr>
            <td rowspan="3" class="text-center font-bold">VERIFIED BY:</td>
            <td>Technician: {{ $granite->senior_tech }} <br> {{ \Carbon\Carbon::parse($granite->senior_tech_date_sign)->format('m/d/Y g:i A') }}</td>
        </tr>
        <tr>
            <td>QA: {{ $granite->qa_sign }}<br> {{ \Carbon\Carbon::parse($granite->qa_sign_date_sign)->format('m/d/Y g:i A') }}</td>
        </tr>
        <tr>
            <td>Second Eye Verifier: {{ $granite->second_eye_verifier }} <br> {{ \Carbon\Carbon::parse($granite->second_eye_verifier_date_sign)->format('m/d/Y g:i A') }}</td>
        </tr>
    </table>

    {{-- Legend --}}
    <table>
        <tr>
            <td class="font-bold" style="width:20%;">LEGEND</td>
            <td>M = Monthly; Q = Quarterly; S = Semi-Annually; A = Annually</td>
        </tr>
        <tr>
            <td class="font-bold">ACTIVITY CODE</td>
            <td>
                A-Check; B-Clean; C-Lubricate; D-Adjust; E-Align; F-Calibrate;
                G-Modify; H-Repair; I-Replace; J-Refill; K-Drain; L-Measure;
                M-Scan/Disk Defragment; N-Change Oil; NA-Not Applicable
            </td>
        </tr>
        <tr>
            <td colspan="2" class="text-right font-bold">
                TELFORD SVC. PHILS., INC. — Maint-75 (Rev.1)
            </td>
        </tr>
    </table>

</body>

</html>