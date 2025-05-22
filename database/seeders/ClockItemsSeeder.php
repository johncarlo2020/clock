<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClockItemsSeeder extends Seeder
{
    public function run()
    {
        $clockItems = [
            ['top' => 148, 'left' => 141, 'width' => 490, 'height' => 490],
            ['top' => 623, 'left' => 18, 'width' => 324, 'height' => 341],
            ['top' => 305, 'left' => 734, 'width' => 290, 'height' => 290], // You might need to decide how to handle right instead of left
            ['top' => 655, 'left' => 500, 'width' => 600, 'height' => 600],
            ['top' => 1005, 'left' => 62, 'width' => 322, 'height' => 322],
            ['top' => 1395, 'left' => 125, 'width' => 390, 'height' => 390],
            ['top' => 1370, 'left' => 700, 'width' => 344, 'height' => 344],
        ];

        $nuc = 6;

        foreach ($clockItems as $item) {
            for ($i = 1; $i < $nuc+1; $i++) {
                DB::table('clocks')->insert([
                    'nuc' => $i,
                    'top' => $item['top'],
                    'left' => $item['left'],
                    'width' => $item['width'],
                    'height' => $item['height'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
