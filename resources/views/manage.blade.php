@extends('layouts.app')

@section('content')
<style>
    body {
        background:
            linear-gradient(rgba(20, 20, 40, 0.7), rgba(20, 20, 40, 0.7)),
            url('https://www.transparenttextures.com/patterns/cubes.png') repeat;
        background-size: 200px 200px;
        color: #eee;
        font-family: 'Orbitron', sans-serif;
        margin: 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .container {
        max-width: 900px;
        margin-top: 3rem;
        margin-left: auto;
        margin-right: auto;
    }

    /* TABLE STYLE FIX */
    table.table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0 8px;
        background-color: transparent !important;
        border: none;
    }

    table.table thead th {
        background-color: #35334a !important;
        color: #c9c9ff !important;
        font-weight: 600;
        font-family: 'Orbitron', sans-serif;
        padding: 12px 15px;
        border: none;
    }

    table.table tbody tr {
        background-color: #1f1e2b !important;
        transition: background 0.3s;
    }

    table.table tbody tr:hover {
        background-color: #2c2b3f !important;
    }

    table.table tbody td {
        color: #e1e1e1 !important;
        padding: 12px 15px;
        border: none !important;
        vertical-align: middle;
        font-family: 'Orbitron', sans-serif;
    }

    table.table tbody td:first-child {
        font-weight: 600;
        color: black !important;
    }

    table.table tbody td:nth-child(2) {
        font-weight: 500;
        color: #b0a78f !important;
    }

    /* Button styling */
    .btn-primary.edit-btn {
        background-color: #7E6651 !important;
        border: none !important;
        box-shadow: 0 3px 6px rgba(126, 102, 81, 0.5);
        font-family: 'Orbitron', sans-serif;
    }

    .btn-primary.edit-btn:hover {
        background-color: #a07f5d !important;
    }

    /* Modal styling */
    .modal-content {
        background-color: #1f1e2b !important;
        color: #e1e1e1 !important;
        font-family: 'Orbitron', sans-serif;
    }

    .modal-header,
    .modal-footer {
        border-color: #35334a !important;
    }

    .form-control.bg-dark {
        background-color: #2c2b3f !important;
        color: #e1e1e1 !important;
        border: 1px solid #555 !important;
    }

    .form-label {
        color: #ccc;
        font-weight: 500;
    }
</style>


<div class="container">
    <h3 class="mb-4" style="font-family: 'Orbitron', sans-serif; color: black;">
        Manage Clock Positions
    </h3>

    <table class="table table-hover shadow-sm rounded">
        <thead>
            <tr>
                <th style="width: 65%;">NUC</th>
                <th style="width: 25%;">Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($nucs as $index => $item)
            <tr>
                <td>{{ $item->nuc }}</td>
                <td>
                    <button class="btn btn-primary edit-btn" data-nuc="{{ $item->nuc }}">
                        Edit
                    </button>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>

<!-- Modal -->
<div class="modal fade" id="clockModal" tabindex="-1" aria-labelledby="clockModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <form id="clockForm" method="POST" class="modal-content">
            @csrf
            @method('POST')
            <div class="modal-header">
                <h5 class="modal-title" id="clockModalLabel">Edit Clock Positions</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body" id="modalBody">
                <!-- Clock inputs loaded dynamically here -->
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-primary" style="background:#7E6651; border:none;">Save
                    changes</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </form>
    </div>
</div>
@endsection

@section('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function () {
                const nuc = this.getAttribute('data-nuc');
                editClocks(nuc);
            });
        });
    });

    function editClocks(nuc) {
        const url = "{{ route('clocks.edit', ':nuc') }}".replace(':nuc', nuc);
        const updateUrl = "{{ route('clocks.update', ':nuc') }}".replace(':nuc', nuc);

        fetch(url, {
            headers: { 'Accept': 'application/json' }
        })
            .then(res => res.json())
            .then(clocks => {
                let formHtml = '';
                clocks.forEach((clock, i) => {
                    formHtml += `
                <div class="mb-3 border rounded p-3" style="border-color: #35334a;">
                    <h6 style="color:#c9c9ff;">Clock ${i + 1}</h6>
                    <input type="hidden" name="clocks[${i}][id]" value="${clock.id}">
                    <div class="row">
                        <div class="col">
                            <label class="form-label" style="color:#ddd;">Top</label>
                            <input type="text" name="clocks[${i}][top]" class="form-control bg-dark text-light border-secondary" value="${clock.top}">
                        </div>
                        <div class="col">
                            <label class="form-label" style="color:#ddd;">Left</label>
                            <input type="text" name="clocks[${i}][left]" class="form-control bg-dark text-light border-secondary" value="${clock.left}">
                        </div>
                        <div class="col">
                            <label class="form-label" style="color:#ddd;">Width</label>
                            <input type="text" name="clocks[${i}][width]" class="form-control bg-dark text-light border-secondary" value="${clock.width}">
                        </div>
                        <div class="col">
                            <label class="form-label" style="color:#ddd;">Height</label>
                            <input type="text" name="clocks[${i}][height]" class="form-control bg-dark text-light border-secondary" value="${clock.height}">
                        </div>
                    </div>
                </div>
                `;
                });

                document.getElementById('modalBody').innerHTML = formHtml;
                document.getElementById('clockForm').action = updateUrl;
                new bootstrap.Modal(document.getElementById('clockModal')).show();
            })
            .catch(err => console.error(err));
    }
</script>
@endsection
