<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Clock;
class ClockController extends Controller
{
    public function index(Request $request)
    {
        $nuc = $request->input('nuc');
        $clocks = Clock::where('nuc', $nuc)->get();
        // dd($clocks);
        // dd($clocks);
        return view('welcome', compact('clocks'));
    }

    public function manage()
    {
        $nucs = Clock::select('nuc')->distinct()->get();
        return view('manage', compact('nucs'));
    }

    public function edit($nuc)
    {
        $clocks = Clock::where('nuc', $nuc)->get();
        return response()->json($clocks); // For modal AJAX
    }

    public function update(Request $request, $nuc)
    {
        foreach ($request->clocks as $clockData) {
            Clock::where('id', $clockData['id'])->update([
                'top' => $clockData['top'],
                'left' => $clockData['left'],
                'width' => $clockData['width'],
                'height' => $clockData['height']
            ]);
        }

        return redirect()->route('clocks.manage')->with('success', 'Clock positions updated!');
    }

}
